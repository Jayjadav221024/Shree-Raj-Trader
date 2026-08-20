import { Schema, model, Document } from 'mongoose';

export interface IMenuGroup extends Document {
  name: string;
  order: number;
  isActive: boolean;
}

const MenuGroupSchema = new Schema<IMenuGroup>({
  name: { type: String, required: true, unique: true },
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export default model<IMenuGroup>('MenuGroup', MenuGroupSchema);
