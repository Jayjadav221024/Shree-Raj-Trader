import { Schema, model, Document } from 'mongoose';

export interface IRoleMaster extends Document {
  name: string;
  description: string;
  isActive: boolean;
}

const RoleMasterSchema = new Schema<IRoleMaster>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export default model<IRoleMaster>('RoleMaster', RoleMasterSchema);
