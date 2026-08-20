"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CurrencySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    symbol: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Currency', CurrencySchema);
