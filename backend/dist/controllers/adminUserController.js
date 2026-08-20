"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminUser = exports.updateAdminUser = exports.createAdminUser = exports.getAdminUsers = void 0;
const zod_1 = require("zod");
const AdminUser_1 = __importDefault(require("../models/AdminUser"));
const apiHelper_1 = require("../utils/apiHelper");
const adminUserCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    mobile: zod_1.z.string().min(10),
    roleId: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true)
});
const adminUserUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    mobile: zod_1.z.string().min(10).optional(),
    roleId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional()
});
const getAdminUsers = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, AdminUser_1.default, req.query, ['name', 'email', 'mobile'], ['roleId']);
};
exports.getAdminUsers = getAdminUsers;
const createAdminUser = async (req, res, next) => {
    try {
        const data = adminUserCreateSchema.parse(req.body);
        const existing = await AdminUser_1.default.findOne({ email: data.email });
        if (existing) {
            res.status(400).json({ success: false, message: 'Email already registered', data: null, meta: null });
            return;
        }
        const newUser = await AdminUser_1.default.create(data);
        res.status(201).json({ success: true, message: 'Admin user created successfully', data: newUser, meta: null });
    }
    catch (error) {
        next(error);
    }
};
exports.createAdminUser = createAdminUser;
const updateAdminUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = adminUserUpdateSchema.parse(req.body);
        const user = await AdminUser_1.default.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'Admin user not found', data: null, meta: null });
            return;
        }
        if (data.email && data.email !== user.email) {
            const existing = await AdminUser_1.default.findOne({ email: data.email });
            if (existing) {
                res.status(400).json({ success: false, message: 'Email already registered', data: null, meta: null });
                return;
            }
        }
        if (data.password) {
            user.password = data.password;
        }
        if (data.name)
            user.name = data.name;
        if (data.email)
            user.email = data.email;
        if (data.mobile)
            user.mobile = data.mobile;
        if (data.roleId)
            user.roleId = data.roleId;
        if (data.isActive !== undefined)
            user.isActive = data.isActive;
        await user.save();
        res.status(200).json({ success: true, message: 'Admin user updated successfully', data: user, meta: null });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAdminUser = updateAdminUser;
const deleteAdminUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await AdminUser_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Admin user not found', data: null, meta: null });
            return;
        }
        res.status(200).json({ success: true, message: 'Admin user deleted successfully', data: deleted, meta: null });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAdminUser = deleteAdminUser;
