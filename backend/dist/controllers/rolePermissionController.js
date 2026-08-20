"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRolePermissions = exports.getRolePermissions = void 0;
const zod_1 = require("zod");
const RolePermission_1 = __importDefault(require("../models/RolePermission"));
const MenuMaster_1 = __importDefault(require("../models/MenuMaster"));
const permissionItemSchema = zod_1.z.object({
    menuId: zod_1.z.string(),
    canView: zod_1.z.boolean(),
    canCreate: zod_1.z.boolean(),
    canEdit: zod_1.z.boolean(),
    canDelete: zod_1.z.boolean()
});
const savePermissionsSchema = zod_1.z.object({
    roleId: zod_1.z.string(),
    permissions: zod_1.z.array(permissionItemSchema)
});
const getRolePermissions = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        const permissions = await RolePermission_1.default.findOne({ roleId });
        if (!permissions) {
            const allMenus = await MenuMaster_1.default.find({ isActive: true }).sort({ order: 1 });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getRolePermissions = getRolePermissions;
const saveRolePermissions = async (req, res, next) => {
    try {
        const { roleId, permissions } = savePermissionsSchema.parse(req.body);
        const updated = await RolePermission_1.default.findOneAndUpdate({ roleId }, { roleId, permissions }, { new: true, upsert: true });
        res.status(200).json({
            success: true,
            message: 'Role permissions saved successfully',
            data: updated,
            meta: null
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveRolePermissions = saveRolePermissions;
