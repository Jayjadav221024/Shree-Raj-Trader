import mongoose, { Schema, Document } from 'mongoose';

/**
 * A single editable block of the public website (hero, footer, "Our Journey", …).
 *
 * The shape of `data` is deliberately free-form: the field list for every
 * section lives in the frontend section registry
 * (`frontend/src/data/sectionRegistry.js`), which is also where the built-in
 * defaults come from. A row exists here only for sections an editor has
 * actually changed — deleting a row restores the built-in copy, which is what
 * the "Reset to default" button does.
 */
export interface ISiteSection extends Document {
  key: string;
  data: Record<string, any>;
  updatedByName: string;
}

const SiteSectionSchema = new Schema<ISiteSection>(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, default: {} },
    updatedByName: { type: String, default: '' }
  },
  { timestamps: true, minimize: false }
);

export const SiteSection = mongoose.model<ISiteSection>('SiteSection', SiteSectionSchema);

export default SiteSection;
