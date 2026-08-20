"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSendEmail = exports.deleteEmailTemplate = exports.updateEmailTemplate = exports.createEmailTemplate = exports.getEmailTemplates = exports.deleteEmailFor = exports.updateEmailFor = exports.createEmailFor = exports.getEmailForList = exports.saveEmailSetup = exports.getEmailSetup = void 0;
const zod_1 = require("zod");
const nodemailer_1 = __importDefault(require("nodemailer"));
const CMS_1 = require("../models/CMS");
const crypto_1 = require("../utils/crypto");
const apiHelper_1 = require("../utils/apiHelper");
const emailSetupSchema = zod_1.z.object({
    host: zod_1.z.string().min(1),
    port: zod_1.z.number().int(),
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
    fromName: zod_1.z.string().min(1),
    fromEmail: zod_1.z.string().email()
});
const emailTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string().min(1),
    variables: zod_1.z.array(zod_1.z.string()).default([])
});
const emailForSchema = zod_1.z.object({
    eventCode: zod_1.z.string().min(1),
    eventName: zod_1.z.string().min(1),
    templateId: zod_1.z.string().nullable().optional()
});
const getEmailSetup = async (req, res, next) => {
    try {
        const setup = await CMS_1.EmailSetup.findOne({});
        if (!setup) {
            res.status(200).json({
                success: true,
                message: 'No SMTP configuration found',
                data: null
            });
            return;
        }
        const decryptedSetup = {
            id: setup._id,
            host: setup.host,
            port: setup.port,
            username: setup.username,
            password: (0, crypto_1.decrypt)(setup.password),
            fromName: setup.fromName,
            fromEmail: setup.fromEmail
        };
        res.status(200).json({
            success: true,
            message: 'SMTP settings retrieved successfully',
            data: decryptedSetup
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEmailSetup = getEmailSetup;
const saveEmailSetup = async (req, res, next) => {
    try {
        const data = emailSetupSchema.parse(req.body);
        const encryptedPassword = (0, crypto_1.encrypt)(data.password);
        const setup = await CMS_1.EmailSetup.findOneAndUpdate({}, { ...data, password: encryptedPassword }, { new: true, upsert: true });
        res.status(200).json({
            success: true,
            message: 'SMTP settings saved successfully',
            data: {
                id: setup._id,
                host: setup.host,
                port: setup.port,
                username: setup.username,
                fromName: setup.fromName,
                fromEmail: setup.fromEmail
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveEmailSetup = saveEmailSetup;
const getEmailForList = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, CMS_1.EmailFor, req.query, ['eventCode', 'eventName'], ['templateId']);
};
exports.getEmailForList = getEmailForList;
const createEmailFor = async (req, res, next) => {
    try {
        const data = emailForSchema.parse(req.body);
        const item = await CMS_1.EmailFor.create(data);
        res.status(201).json({ success: true, message: 'Email Event mapping created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createEmailFor = createEmailFor;
const updateEmailFor = async (req, res, next) => {
    try {
        const data = emailForSchema.partial().parse(req.body);
        const item = await CMS_1.EmailFor.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Email Event mapping updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmailFor = updateEmailFor;
const deleteEmailFor = async (req, res, next) => {
    try {
        await CMS_1.EmailFor.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Email Event mapping deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEmailFor = deleteEmailFor;
const getEmailTemplates = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, CMS_1.EmailTemplate, req.query, ['name', 'subject', 'body']);
};
exports.getEmailTemplates = getEmailTemplates;
const createEmailTemplate = async (req, res, next) => {
    try {
        const data = emailTemplateSchema.parse(req.body);
        const item = await CMS_1.EmailTemplate.create(data);
        res.status(201).json({ success: true, message: 'Email Template created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createEmailTemplate = createEmailTemplate;
const updateEmailTemplate = async (req, res, next) => {
    try {
        const data = emailTemplateSchema.partial().parse(req.body);
        const item = await CMS_1.EmailTemplate.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Email Template updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmailTemplate = updateEmailTemplate;
const deleteEmailTemplate = async (req, res, next) => {
    try {
        const linked = await CMS_1.EmailFor.findOne({ templateId: req.params.id });
        if (linked) {
            res.status(400).json({
                success: false,
                message: `Cannot delete template. It is currently linked to event: ${linked.eventName}`,
                data: null
            });
            return;
        }
        await CMS_1.EmailTemplate.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Email Template deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEmailTemplate = deleteEmailTemplate;
const testSendEmail = async (req, res, next) => {
    try {
        const { templateId, testEmail } = req.body;
        if (!testEmail) {
            res.status(400).json({ success: false, message: 'Test recipient email is required', data: null });
            return;
        }
        const setup = await CMS_1.EmailSetup.findOne({});
        if (!setup) {
            res.status(400).json({ success: false, message: 'SMTP settings not configured. Configure SMTP setup first.', data: null });
            return;
        }
        const template = await CMS_1.EmailTemplate.findById(templateId);
        if (!template) {
            res.status(400).json({ success: false, message: 'Email Template not found', data: null });
            return;
        }
        const decryptedPassword = (0, crypto_1.decrypt)(setup.password);
        const transporter = nodemailer_1.default.createTransport({
            host: setup.host,
            port: setup.port,
            secure: setup.port === 465,
            auth: {
                user: setup.username,
                pass: decryptedPassword
            }
        });
        let body = template.body;
        let subject = template.subject;
        const mockVars = {
            name: 'John Doe',
            otp: '123456',
            link: 'https://shreeraj-traders.com/reset-password',
            email: testEmail,
            date: new Date().toLocaleDateString()
        };
        template.variables.forEach(v => {
            const regex = new RegExp(`{{${v}}}`, 'g');
            body = body.replace(regex, mockVars[v] || `[${v}]`);
            subject = subject.replace(regex, mockVars[v] || `[${v}]`);
        });
        await transporter.sendMail({
            from: `"${setup.fromName}" <${setup.fromEmail}>`,
            to: testEmail,
            subject: `[TEST] ${subject}`,
            html: body
        });
        res.status(200).json({
            success: true,
            message: 'Test email sent successfully!'
        });
    }
    catch (error) {
        console.error('[Mail Error] Send mail error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to send test email: ${error.message || 'SMTP Connection Error'}`
        });
    }
};
exports.testSendEmail = testSendEmail;
