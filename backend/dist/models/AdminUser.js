"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AdminUserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    roleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RoleMaster', required: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
AdminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password || '', salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
AdminUserSchema.methods.comparePassword = async function (candidate) {
    return bcryptjs_1.default.compare(candidate, this.password || '');
};
exports.default = (0, mongoose_1.model)('AdminUser', AdminUserSchema);
