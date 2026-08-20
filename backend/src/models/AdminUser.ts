import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobile: string;
  roleId: Types.ObjectId;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'RoleMaster', required: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

AdminUserSchema.pre<IAdminUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password || '', salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

AdminUserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password || '');
};

export default model<IAdminUser>('AdminUser', AdminUserSchema);
