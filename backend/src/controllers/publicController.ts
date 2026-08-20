import { Request, Response, NextFunction } from 'express';
import { Category, Product, Testimonial, FAQ, Blog, Inquiry } from '../models/WebsiteContent';
import { z } from 'zod';

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(5),
  company: z.string().optional().default('General Lead'),
  productName: z.string().min(1),
  quantity: z.number().min(1).default(1),
  message: z.string().optional().default('')
});

export const getPublicCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Category.find({ isActive: true });
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getPublicProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({ isActive: true });
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getPublicTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Testimonial.find({ isActive: true });
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getPublicFAQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getPublicBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getPublicBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Blog.findOne({ slug: req.params.slug, isActive: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
};

export const createPublicInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = inquirySchema.parse(req.body);
    const item = await Inquiry.create(data);
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: item });
  } catch (error) { next(error); }
};
