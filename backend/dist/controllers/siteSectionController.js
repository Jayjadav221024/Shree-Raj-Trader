"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSiteSection = exports.saveSiteSection = exports.getSiteSections = exports.getPublicSiteContent = void 0;
const zod_1 = require("zod");
const SiteSection_1 = __importDefault(require("../models/SiteSection"));
const AdminUser_1 = __importDefault(require("../models/AdminUser"));
const saveSchema = zod_1.z.object({
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.any())
});
/** Section keys are registry ids such as `home.hero` or `global.footer`. */
const KEY_PATTERN = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/i;
const assertValidKey = (key, res) => {
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
const getPublicSiteContent = async (req, res, next) => {
    try {
        const rows = await SiteSection_1.default.find({}).lean();
        const map = {};
        rows.forEach((row) => {
            map[row.key] = row.data || {};
        });
        res.status(200).json({ success: true, message: 'Website content retrieved', data: map });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicSiteContent = getPublicSiteContent;
/**
 * Admin read. Same overrides, plus the audit trail the Website Editor shows
 * next to each section ("edited by X on Y").
 */
const getSiteSections = async (req, res, next) => {
    try {
        const rows = await SiteSection_1.default.find({}).lean();
        const overrides = {};
        const meta = {};
        rows.forEach((row) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSiteSections = getSiteSections;
const saveSiteSection = async (req, res, next) => {
    try {
        const key = req.params.key;
        if (!assertValidKey(key, res))
            return;
        const { data } = saveSchema.parse(req.body);
        let editorName = req.user?.roleName || 'Administrator';
        if (req.user?.id) {
            const account = await AdminUser_1.default.findById(req.user.id).select('name').lean();
            if (account?.name)
                editorName = account.name;
        }
        const section = await SiteSection_1.default.findOneAndUpdate({ key }, { key, data, updatedByName: editorName }, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.status(200).json({
            success: true,
            message: 'Section saved. The website is now showing your changes.',
            data: { key: section.key, data: section.data, updatedByName: section.updatedByName }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveSiteSection = saveSiteSection;
/** Drops the override row so the section falls back to its built-in copy. */
const resetSiteSection = async (req, res, next) => {
    try {
        const key = req.params.key;
        if (!assertValidKey(key, res))
            return;
        await SiteSection_1.default.findOneAndDelete({ key });
        res.status(200).json({
            success: true,
            message: 'Section reset to its original content',
            data: { key }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetSiteSection = resetSiteSection;
