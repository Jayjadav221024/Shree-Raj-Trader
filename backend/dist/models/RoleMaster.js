"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoleMasterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('RoleMaster', RoleMasterSchema);
