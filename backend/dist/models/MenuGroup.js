"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MenuGroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('MenuGroup', MenuGroupSchema);
