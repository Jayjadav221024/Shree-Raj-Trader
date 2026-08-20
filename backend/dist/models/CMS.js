"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFor = exports.EmailTemplate = exports.EmailSetup = void 0;
const mongoose_1 = require("mongoose");
const EmailSetupSchema = new mongoose_1.Schema({
    host: { type: String, required: true },
    port: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true }
}, { timestamps: true });
const EmailTemplateSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    variables: [{ type: String }]
}, { timestamps: true });
const EmailForSchema = new mongoose_1.Schema({
    eventCode: { type: String, required: true, unique: true },
    eventName: { type: String, required: true },
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
}, { timestamps: true });
exports.EmailSetup = (0, mongoose_1.model)('EmailSetup', EmailSetupSchema);
exports.EmailTemplate = (0, mongoose_1.model)('EmailTemplate', EmailTemplateSchema);
exports.EmailFor = (0, mongoose_1.model)('EmailFor', EmailForSchema);
