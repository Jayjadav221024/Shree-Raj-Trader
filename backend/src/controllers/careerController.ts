import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { JobOpening, JobApplication } from '../models/Career';
import { handlePagedRequest } from '../utils/apiHelper';

const jobOpeningSchema = z.object({
  title: z.string().min(2),
  department: z.string().optional().default(''),
  location: z.string().optional().default(''),
  employmentType: z.string().optional().default('Full-time'),
  experience: z.string().optional().default(''),
  description: z.string().optional().default(''),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  order: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true)
});

const jobApplicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  position: z.string().optional().default('General application'),
  experience: z.string().optional().default(''),
  message: z.string().optional().default(''),
  resumeUrl: z.string().optional().default('')
});

// ---------------------------------------------------------------------------
// Public — used by the unlisted careers page
// ---------------------------------------------------------------------------

export const getPublicJobOpenings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await JobOpening.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, message: 'Job openings retrieved', data: items });
  } catch (error) {
    next(error);
  }
};

export const createPublicJobApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = jobApplicationSchema.parse(req.body);
    const item = await JobApplication.create(data);
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { id: item._id }
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Admin — Job Openings master
// ---------------------------------------------------------------------------

export const getJobOpeningMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, JobOpening, req.query, [
    'title',
    'department',
    'location',
    'employmentType',
    'experience'
  ]);
};

export const createJobOpeningMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = jobOpeningSchema.parse(req.body);
    const item = await JobOpening.create(data);
    res.status(201).json({ success: true, message: 'Job opening created successfully', data: item });
  } catch (error) {
    next(error);
  }
};

export const updateJobOpeningMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = jobOpeningSchema.partial().parse(req.body);
    const item = await JobOpening.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Job opening updated successfully', data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteJobOpeningMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await JobOpening.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Job opening deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Admin — Applications received
// ---------------------------------------------------------------------------

export const getJobApplicationMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, JobApplication, req.query, [
    'name',
    'email',
    'phone',
    'position',
    'experience',
    'message',
    'status'
  ]);
};

/** Applications are read-only apart from the review status. */
export const updateJobApplicationMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = z.object({ status: z.string().min(1) }).parse(req.body);
    const item = await JobApplication.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Application status updated', data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteJobApplicationMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};
