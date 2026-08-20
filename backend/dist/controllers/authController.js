"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const AdminUser_1 = __importDefault(require("../models/AdminUser"));
const LoginAttemptLog_1 = __importDefault(require("../models/LoginAttemptLog"));
const RolePermission_1 = __importDefault(require("../models/RolePermission"));
const MenuMaster_1 = __importDefault(require("../models/MenuMaster"));
const MenuGroup_1 = __importDefault(require("../models/MenuGroup"));
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;
/**
 * Cookie flags for the session token.
 *
 * `sameSite: 'strict'` blocks the cookie whenever the admin panel is served from
 * a different site than the API (any production split-host deployment), which
 * makes every authenticated request look signed-out. 'none' + secure is the
 * combination browsers accept cross-site; 'lax' keeps plain HTTP dev working.
 */
const cookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax'),
        path: '/'
    };
};
const login = async (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await AdminUser_1.default.findOne({ email }).populate('roleId');
        if (!user || !user.isActive) {
            await LoginAttemptLog_1.default.create({ email, ip, userAgent, status: 'fail' });
            res.status(401).json({ success: false, message: 'Invalid credentials or account is inactive.', data: null, meta: null });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await LoginAttemptLog_1.default.create({ email, ip, userAgent, status: 'fail' });
            res.status(401).json({ success: false, message: 'Invalid credentials.', data: null, meta: null });
            return;
        }
        await LoginAttemptLog_1.default.create({ email, ip, userAgent, status: 'success' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, roleId: user.roleId._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { ...cookieOptions(), maxAge: TOKEN_MAX_AGE });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.roleId.name
                }
            },
            meta: null
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Invalid input parameters.',
                data: null,
                meta: null
            });
            return;
        }
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        // clearCookie only matches a cookie whose flags line up with the ones it was set with.
        res.clearCookie('token', cookieOptions());
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
            data: null,
            meta: null
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated', data: null, meta: null });
            return;
        }
        const user = await AdminUser_1.default.findById(req.user.id).populate('roleId');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found', data: null, meta: null });
            return;
        }
        const rolePerm = await RolePermission_1.default.findOne({ roleId: req.user.roleId }).populate('permissions.menuId');
        const menuGroups = await MenuGroup_1.default.find({ isActive: true }).sort({ order: 1 });
        const allMenus = await MenuMaster_1.default.find({ isActive: true }).sort({ order: 1 });
        let permittedMenus = [];
        if (req.user.roleName === 'Super Admin') {
            permittedMenus = allMenus;
        }
        else if (rolePerm) {
            const permittedIds = rolePerm.permissions
                .filter((p) => p.canView)
                .map((p) => p.menuId._id.toString());
            permittedMenus = allMenus.filter((m) => permittedIds.includes(m._id.toString()));
        }
        res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.roleId.name
                },
                menuGroups,
                permittedMenus,
                permissions: rolePerm ? rolePerm.permissions : []
            },
            meta: null
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
