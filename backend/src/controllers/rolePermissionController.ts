import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import RolePermission from '../models/RolePermission';
import MenuMaster from '../models/MenuMaster';

const permissionItemSchema = z.object({
  menuId: z.string(),
  canView: z.boolean(),
  canCreate: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean()
});

const savePermissionsSchema = z.object({
  roleId: z.string(),
  permissions: z.array(permissionItemSchema)
});

export const getRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roleId } = req.params;
    const permissions = await RolePermission.findOne({ roleId });

    if (!permissions) {
      const allMenus = await MenuMaster.find({ isActive: true }).sort({ order: 1 });
      const defaultPermissions = allMenus.map((m) => ({
        menuId: m._id,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false
      }));

      res.status(200).json({
        success: true,
        message: 'Default permissions generated',
        data: {
          roleId,
          permissions: defaultPermissions
        },
        meta: null
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Role permissions retrieved successfully',
      data: permissions,
      meta: null
    });
  } catch (error) {
    next(error);
  }
};

export const saveRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roleId, permissions } = savePermissionsSchema.parse(req.body);

    const updated = await RolePermission.findOneAndUpdate(
      { roleId },
      { roleId, permissions },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Role permissions saved successfully',
      data: updated,
      meta: null
    });
  } catch (error) {
    next(error);
  }
};
