import { Schema, model, Document } from 'mongoose';

export interface ICurrency extends Document {
  name: string;
  code: string;
  symbol: string;
  isActive: boolean;
}

const CurrencySchema = new Schema<ICurrency>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export default model<ICurrency>('Currency', CurrencySchema);
