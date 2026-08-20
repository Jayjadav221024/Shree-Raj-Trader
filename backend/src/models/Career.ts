import mongoose, { Schema, Document } from 'mongoose';

/**
 * A vacancy shown on the careers page (/career/).
 *
 * The page itself is unlisted — it is not in the site navigation — so openings
 * are only seen by people given the link. Deactivating a role hides it without
 * losing the record.
 */
export interface IJobOpening extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  order: number;
  isActive: boolean;
}

const JobOpeningSchema = new Schema<IJobOpening>(
  {
    title: { type: String, required: true },
    department: { type: String, default: '' },
    location: { type: String, default: '' },
    employmentType: { type: String, default: 'Full-time' },
    experience: { type: String, default: '' },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const JobOpening = mongoose.model<IJobOpening>('JobOpening', JobOpeningSchema);

/** A submission from the application form on the careers page. */
export interface IJobApplication extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
  resumeUrl: string;
  status: string;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, default: 'General application' },
    experience: { type: String, default: '' },
    message: { type: String, default: '' },
    // Path to the uploaded CV, or a link the applicant pasted in.
    resumeUrl: { type: String, default: '' },
    status: { type: String, default: 'New' }
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
