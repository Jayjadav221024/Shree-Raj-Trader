import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { EmailSetup, EmailTemplate, EmailFor } from '../models/CMS';
import { encrypt, decrypt } from '../utils/crypto';
import { handlePagedRequest } from '../utils/apiHelper';

const emailSetupSchema = z.object({
  host: z.string().min(1),
  port: z.number().int(),
  username: z.string().min(1),
  password: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email()
});

const emailTemplateSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  variables: z.array(z.string()).default([])
});

const emailForSchema = z.object({
  eventCode: z.string().min(1),
  eventName: z.string().min(1),
  templateId: z.string().nullable().optional()
});

export const getEmailSetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setup = await EmailSetup.findOne({});
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
      password: decrypt(setup.password),
      fromName: setup.fromName,
      fromEmail: setup.fromEmail
    };

    res.status(200).json({
      success: true,
      message: 'SMTP settings retrieved successfully',
      data: decryptedSetup
    });
  } catch (error) {
    next(error);
  }
};

export const saveEmailSetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = emailSetupSchema.parse(req.body);
    const encryptedPassword = encrypt(data.password);

    const setup = await EmailSetup.findOneAndUpdate(
      {},
      { ...data, password: encryptedPassword },
      { new: true, upsert: true }
    );

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
  } catch (error) {
    next(error);
  }
};

export const getEmailForList = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, EmailFor, req.query, ['eventCode', 'eventName'], ['templateId']);
};

export const createEmailFor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = emailForSchema.parse(req.body);
    const item = await EmailFor.create(data);
    res.status(201).json({ success: true, message: 'Email Event mapping created successfully', data: item });
  } catch (error) { next(error); }
};

export const updateEmailFor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = emailForSchema.partial().parse(req.body);
    const item = await EmailFor.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Email Event mapping updated successfully', data: item });
  } catch (error) { next(error); }
};

export const deleteEmailFor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await EmailFor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Email Event mapping deleted successfully' });
  } catch (error) { next(error); }
};

export const getEmailTemplates = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, EmailTemplate, req.query, ['name', 'subject', 'body']);
};

export const createEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = emailTemplateSchema.parse(req.body);
    const item = await EmailTemplate.create(data);
    res.status(201).json({ success: true, message: 'Email Template created successfully', data: item });
  } catch (error) { next(error); }
};

export const updateEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = emailTemplateSchema.partial().parse(req.body);
    const item = await EmailTemplate.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Email Template updated successfully', data: item });
  } catch (error) { next(error); }
};

export const deleteEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const linked = await EmailFor.findOne({ templateId: req.params.id });
    if (linked) {
      res.status(400).json({
        success: false,
        message: `Cannot delete template. It is currently linked to event: ${linked.eventName}`,
        data: null
      });
      return;
    }
    await EmailTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Email Template deleted successfully' });
  } catch (error) { next(error); }
};

export const testSendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { templateId, testEmail } = req.body;
    if (!testEmail) {
      res.status(400).json({ success: false, message: 'Test recipient email is required', data: null });
      return;
    }

    const setup = await EmailSetup.findOne({});
    if (!setup) {
      res.status(400).json({ success: false, message: 'SMTP settings not configured. Configure SMTP setup first.', data: null });
      return;
    }

    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      res.status(400).json({ success: false, message: 'Email Template not found', data: null });
      return;
    }

    const decryptedPassword = decrypt(setup.password);

    const transporter = nodemailer.createTransport({
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
    
    const mockVars: Record<string, string> = {
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
  } catch (error: any) {
    console.error('[Mail Error] Send mail error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to send test email: ${error.message || 'SMTP Connection Error'}`
    });
  }
};
