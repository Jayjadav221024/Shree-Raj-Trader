import { Schema, model, Document, Types } from 'mongoose';

export interface IEmailSetup extends Document {
  host: string;
  port: number;
  username: string;
  password: string; 
  fromName: string;
  fromEmail: string;
}

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  body: string; 
  variables: string[]; 
}

export interface IEmailFor extends Document {
  eventCode: string; 
  eventName: string;
  templateId?: Types.ObjectId | null;
}

const EmailSetupSchema = new Schema<IEmailSetup>({
  host: { type: String, required: true },
  port: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fromName: { type: String, required: true },
  fromEmail: { type: String, required: true }
}, { timestamps: true });

const EmailTemplateSchema = new Schema<IEmailTemplate>({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [{ type: String }]
}, { timestamps: true });

const EmailForSchema = new Schema<IEmailFor>({
  eventCode: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
}, { timestamps: true });

export const EmailSetup = model<IEmailSetup>('EmailSetup', EmailSetupSchema);
export const EmailTemplate = model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
export const EmailFor = model<IEmailFor>('EmailFor', EmailForSchema);
