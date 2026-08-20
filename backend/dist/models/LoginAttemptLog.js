"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LoginAttemptLogSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    status: { type: String, enum: ['success', 'fail'], required: true }
});
exports.default = (0, mongoose_1.model)('LoginAttemptLog', LoginAttemptLogSchema);
