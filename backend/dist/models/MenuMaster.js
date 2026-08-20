"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MenuMasterSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    icon: { type: String, required: true },
    route: { type: String, required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MenuMaster', default: null },
    menuGroupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MenuGroup', required: true },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('MenuMaster', MenuMasterSchema);
