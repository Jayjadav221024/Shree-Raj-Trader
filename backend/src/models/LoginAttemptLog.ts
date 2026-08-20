import { Schema, model, Document } from 'mongoose';

export interface ILoginAttemptLog extends Document {
  email: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  status: 'success' | 'fail';
}

const LoginAttemptLogSchema = new Schema<ILoginAttemptLog>({
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  status: { type: String, enum: ['success', 'fail'], required: true }
});

export default model<ILoginAttemptLog>('LoginAttemptLog', LoginAttemptLogSchema);
