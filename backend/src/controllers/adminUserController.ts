import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import AdminUser from '../models/AdminUser';
import { handlePagedRequest } from '../utils/apiHelper';

const adminUserCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  mobile: z.string().min(10),
  roleId: z.string(),
  isActive: z.boolean().default(true)
});

const adminUserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  mobile: z.string().min(10).optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional()
});

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, AdminUser, req.query, ['name', 'email', 'mobile'], ['roleId']);
};

export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = adminUserCreateSchema.parse(req.body);
    const existing = await AdminUser.findOne({ email: data.email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered', data: null, meta: null });
      return;
    }

    const newUser = await AdminUser.create(data);
    res.status(201).json({ success: true, message: 'Admin user created successfully', data: newUser, meta: null });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = adminUserUpdateSchema.parse(req.body);

    const user = await AdminUser.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Admin user not found', data: null, meta: null });
      return;
    }

    if (data.email && data.email !== user.email) {
      const existing = await AdminUser.findOne({ email: data.email });
      if (existing) {
        res.status(400).json({ success: false, message: 'Email already registered', data: null, meta: null });
        return;
      }
    }

    if (data.password) {
      user.password = data.password;
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.mobile) user.mobile = data.mobile;
    if (data.roleId) user.roleId = data.roleId as any;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    await user.save();

    res.status(200).json({ success: true, message: 'Admin user updated successfully', data: user, meta: null });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await AdminUser.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Admin user not found', data: null, meta: null });
      return;
    }
    res.status(200).json({ success: true, message: 'Admin user deleted successfully', data: deleted, meta: null });
  } catch (error) {
    next(error);
  }
};
