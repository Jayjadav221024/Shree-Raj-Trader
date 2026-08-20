import { Schema, model, Document, Types } from 'mongoose';

export interface IMenuMaster extends Document {
  label: string;
  icon: string;
  route: string;
  parentId?: Types.ObjectId | null;
  menuGroupId: Types.ObjectId;
  order: number;
  isActive: boolean;
}

const MenuMasterSchema = new Schema<IMenuMaster>({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  route: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'MenuMaster', default: null },
  menuGroupId: { type: Schema.Types.ObjectId, ref: 'MenuGroup', required: true },
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export default model<IMenuMaster>('MenuMaster', MenuMasterSchema);
