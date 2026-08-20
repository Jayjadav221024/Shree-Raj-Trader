"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AdminUser_1 = __importDefault(require("../models/AdminUser"));
const RolePermission_1 = __importDefault(require("../models/RolePermission"));
const MenuMaster_1 = __importDefault(require("../models/MenuMaster"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
        if (!token) {
            res.status(401).json({ success: false, message: 'Authentication required. No token provided.', data: null, meta: null });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await AdminUser_1.default.findById(decoded.id).populate('roleId');
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User is inactive or does not exist.', data: null, meta: null });
            return;
        }
        const role = user.roleId;
        if (!role || !role.isActive) {
            res.status(401).json({ success: false, message: 'User role is inactive or does not exist.', data: null, meta: null });
            return;
        }
        req.user = {
            id: user.id,
            roleId: role.id,
            roleName: role.name
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.', data: null, meta: null });
    }
};
exports.authenticate = authenticate;
const checkPermission = (menuRoute, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized.', data: null, meta: null });
                return;
            }
            if (req.user.roleName === 'Super Admin') {
                next();
                return;
            }
            const menu = await MenuMaster_1.default.findOne({ route: menuRoute, isActive: true });
            if (!menu) {
                res.status(403).json({ success: false, message: 'Access Denied: Menu item not found.', data: null, meta: null });
                return;
            }
            const rolePerm = await RolePermission_1.default.findOne({
                roleId: req.user.roleId,
                'permissions.menuId': menu._id
            });
            if (!rolePerm) {
                res.status(403).json({ success: false, message: 'Access Denied: No permission assigned.', data: null, meta: null });
                return;
            }
            const userPermission = rolePerm.permissions.find((p) => p.menuId.toString() === menu._id.toString());
            if (!userPermission || !userPermission[action]) {
                res.status(403).json({ success: false, message: `Access Denied: You do not have permission to perform this action.`, data: null, meta: null });
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPermission = checkPermission;
