import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import SiteSection from '../models/SiteSection';
import AdminUser from '../models/AdminUser';
import { AuthRequest } from '../middlewares/auth';

const saveSchema = z.object({
  data: z.record(z.string(), z.any())
});

/** Section keys are registry ids such as `home.hero` or `global.footer`. */
const KEY_PATTERN = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/i;

const assertValidKey = (key: string, res: Response): boolean => {
  if (!KEY_PATTERN.test(key)) {
    res.status(400).json({ success: false, message: 'Invalid section key', data: null });
    return false;
  }
  return true;
};

/**
 * Public read used by the website itself. Returns one flat map of
 * `{ sectionKey: overrides }` so the frontend can merge it over its defaults in
 * a single pass.
 */
export const getPublicSiteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await SiteSection.find({}).lean();
    const map: Record<string, any> = {};
    rows.forEach((row) => {
      map[row.key] = row.data || {};
    });
    res.status(200).json({ success: true, message: 'Website content retrieved', data: map });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin read. Same overrides, plus the audit trail the Website Editor shows
 * next to each section ("edited by X on Y").
 */
export const getSiteSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await SiteSection.find({}).lean();
    const overrides: Record<string, any> = {};
    const meta: Record<string, any> = {};
    rows.forEach((row: any) => {
      overrides[row.key] = row.data || {};
      meta[row.key] = {
        updatedAt: row.updatedAt,
        updatedByName: row.updatedByName || ''
      };
    });
    res.status(200).json({
      success: true,
      message: 'Website sections retrieved',
      data: { overrides, meta }
    });
  } catch (error) {
    next(error);
  }
};

export const saveSiteSection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const key = req.params.key;
    if (!assertValidKey(key, res)) return;

    const { data } = saveSchema.parse(req.body);

    let editorName = req.user?.roleName || 'Administrator';
    if (req.user?.id) {
      const account = await AdminUser.findById(req.user.id).select('name').lean();
      if (account?.name) editorName = account.name;
    }

    const section = await SiteSection.findOneAndUpdate(
      { key },
      { key, data, updatedByName: editorName },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Section saved. The website is now showing your changes.',
      data: { key: section.key, data: section.data, updatedByName: section.updatedByName }
    });
  } catch (error) {
    next(error);
  }
};

/** Drops the override row so the section falls back to its built-in copy. */
export const resetSiteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.key;
    if (!assertValidKey(key, res)) return;

    await SiteSection.findOneAndDelete({ key });
    res.status(200).json({
      success: true,
      message: 'Section reset to its original content',
      data: { key }
    });
  } catch (error) {
    next(error);
  }
};
