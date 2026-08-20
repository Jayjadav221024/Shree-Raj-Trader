"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = exports.State = exports.Country = void 0;
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
const StateSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    countryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Country', required: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
StateSchema.index({ name: 1, countryId: 1 }, { unique: true });
const CitySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    stateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'State', required: true },
    isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });
CitySchema.index({ name: 1, stateId: 1 }, { unique: true });
exports.Country = (0, mongoose_1.model)('Country', CountrySchema);
exports.State = (0, mongoose_1.model)('State', StateSchema);
exports.City = (0, mongoose_1.model)('City', CitySchema);
