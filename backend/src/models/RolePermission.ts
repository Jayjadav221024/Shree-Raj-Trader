import { Schema, model, Document, Types } from 'mongoose';

export interface IPermissionItem {
  menuId: Types.ObjectId;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface IRolePermission extends Document {
  roleId: Types.ObjectId;
  permissions: IPermissionItem[];
}

const PermissionItemSchema = new Schema<IPermissionItem>({
  menuId: { type: Schema.Types.ObjectId, ref: 'MenuMaster', required: true },
  canView: { type: Boolean, default: false },
  canCreate: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false }
}, { _id: false });

const RolePermissionSchema = new Schema<IRolePermission>({
  roleId: { type: Schema.Types.ObjectId, ref: 'RoleMaster', required: true, unique: true },
  permissions: [PermissionItemSchema]
}, { timestamps: true });

export default model<IRolePermission>('RolePermission', RolePermissionSchema);
