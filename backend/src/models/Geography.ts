import { Schema, model, Document, Types } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  code: string;
  isActive: boolean;
}

export interface IState extends Document {
  name: string;
  countryId: Types.ObjectId;
  isActive: boolean;
}

export interface ICity extends Document {
  name: string;
  stateId: Types.ObjectId;
  isActive: boolean;
}

const CountrySchema = new Schema<ICountry>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

const StateSchema = new Schema<IState>({
  name: { type: String, required: true },
  countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

StateSchema.index({ name: 1, countryId: 1 }, { unique: true });

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true },
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });

CitySchema.index({ name: 1, stateId: 1 }, { unique: true });

export const Country = model<ICountry>('Country', CountrySchema);
export const State = model<IState>('State', StateSchema);
export const City = model<ICity>('City', CitySchema);
