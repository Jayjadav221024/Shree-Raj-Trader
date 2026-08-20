import mongoose, { Schema, Document } from 'mongoose';

// 1. Category Schema
export interface ICategory extends Document {
  id: string; // e.g. switchgears
  title: string;
  badge: string;
  description: string;
  imageKey: string;
  imageAlt: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  badge: { type: String, required: true },
  description: { type: String, required: true },
  imageKey: { type: String, required: true },
  // Screen-reader / SEO description of the picture. Blank falls back to the title.
  imageAlt: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

// 2. Product Schema
export interface IProduct extends Document {
  slug: string;
  name: string;
  brand: string;
  categoryId: string; // string reference key (matches Category.id)
  imageKey: string;
  imageAlt: string;
  longDescription: string;
  applications: string;
  specs: string[];
  liveSpecs: string[];
  attributes: Record<string, string>;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  categoryId: { type: String, required: true },
  imageKey: { type: String, required: true },
  // Screen-reader / SEO description of the picture. Blank falls back to the name.
  imageAlt: { type: String, default: '' },
  longDescription: { type: String, required: true },
  applications: { type: String, default: '' },
  specs: { type: [String], default: [] },
  liveSpecs: { type: [String], default: [] },
  attributes: { type: Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

// 3. Testimonial Schema
export interface ITestimonial extends Document {
  client: string;
  company: string;
  feedback: string;
  isActive: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>({
  client: { type: String, required: true },
  company: { type: String, required: true },
  feedback: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

// 4. FAQ Schema
export interface IFAQ extends Document {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);

// 5. Blog Schema
export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageKey: string;
  imageAlt: string;
  tags: string[];
  isActive: boolean;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Shree Raj Traders Admin' },
  date: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  imageKey: { type: String, required: true },
  // Screen-reader / SEO description of the picture. Blank falls back to the title.
  imageAlt: { type: String, default: '' },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

// 6. Inquiry Schema
export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  productName: string;
  quantity: number;
  message: string;
  timestamp: Date;
}

const InquirySchema = new Schema<IInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
