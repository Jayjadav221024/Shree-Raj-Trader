"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PermissionItemSchema = new mongoose_1.Schema({
    menuId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MenuMaster', required: true },
    canView: { type: Boolean, default: false },
    canCreate: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
}, { _id: false });
const RolePermissionSchema = new mongoose_1.Schema({
    roleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RoleMaster', required: true, unique: true },
    permissions: [PermissionItemSchema]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('RolePermission', RolePermissionSchema);
