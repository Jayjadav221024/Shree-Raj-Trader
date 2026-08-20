import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import RoleMaster from '../models/RoleMaster';
import MenuGroup from '../models/MenuGroup';
import MenuMaster from '../models/MenuMaster';
import { Country, State, City } from '../models/Geography';
import Currency from '../models/Currency';
import LoginAttemptLog from '../models/LoginAttemptLog';
import { Category, Product, Testimonial, FAQ, Blog, Inquiry } from '../models/WebsiteContent';
import { handlePagedRequest } from '../utils/apiHelper';

const roleSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  isActive: z.boolean().default(true)
});

const menuGroupSchema = z.object({
  name: z.string().min(2),
  order: z.number().default(0),
  isActive: z.boolean().default(true)
});

const menuMasterSchema = z.object({
  label: z.string().min(2),
  icon: z.string(),
  route: z.string(),
  parentId: z.string().nullable().optional(),
  menuGroupId: z.string(),
  order: z.number().default(0),
  isActive: z.boolean().default(true)
});

const countrySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  isActive: z.boolean().default(true)
});

const stateSchema = z.object({
  name: z.string().min(2),
  countryId: z.string(),
  isActive: z.boolean().default(true)
});

const citySchema = z.object({
  name: z.string().min(2),
  stateId: z.string(),
  isActive: z.boolean().default(true)
});

const currencySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  symbol: z.string(),
  isActive: z.boolean().default(true)
});

// Role Master Controllers
export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, RoleMaster, req.query, ['name', 'description']);
};
export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roleSchema.parse(req.body);
    const item = await RoleMaster.create(data);
    res.status(201).json({ success: true, message: 'Role created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roleSchema.partial().parse(req.body);
    const item = await RoleMaster.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Role updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await RoleMaster.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (error) { next(error); }
};

// Menu Group Controllers
export const getMenuGroups = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, MenuGroup, req.query, ['name']);
};
export const createMenuGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = menuGroupSchema.parse(req.body);
    const item = await MenuGroup.create(data);
    res.status(201).json({ success: true, message: 'Menu Group created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateMenuGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = menuGroupSchema.partial().parse(req.body);
    const item = await MenuGroup.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Menu Group updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteMenuGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await MenuGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Menu Group deleted successfully' });
  } catch (error) { next(error); }
};

// Menu Master Controllers
export const getMenus = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, MenuMaster, req.query, ['label', 'route'], ['menuGroupId', 'parentId']);
};
export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = menuMasterSchema.parse(req.body);
    const item = await MenuMaster.create(data);
    res.status(201).json({ success: true, message: 'Menu created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = menuMasterSchema.partial().parse(req.body);
    const item = await MenuMaster.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Menu updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await MenuMaster.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Menu deleted successfully' });
  } catch (error) { next(error); }
};

// Country Controllers
export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Country, req.query, ['name', 'code']);
};
export const createCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = countrySchema.parse(req.body);
    const item = await Country.create(data);
    res.status(201).json({ success: true, message: 'Country created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = countrySchema.partial().parse(req.body);
    const item = await Country.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Country updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const states = await State.find({ countryId: id });
    const stateIds = states.map(s => s._id);
    await City.deleteMany({ stateId: { $in: stateIds } });
    await State.deleteMany({ countryId: id });
    await Country.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Country and cascaded states/cities deleted successfully' });
  } catch (error) { next(error); }
};

// State Controllers
export const getStates = async (req: Request, res: Response, next: NextFunction) => {
  const customFilter: any = {};
  if (req.query.countryId) {
    customFilter.countryId = req.query.countryId;
  }
  await handlePagedRequest(res, State, req.query, ['name'], ['countryId'], customFilter);
};
export const createState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = stateSchema.parse(req.body);
    const item = await State.create(data);
    res.status(201).json({ success: true, message: 'State created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = stateSchema.partial().parse(req.body);
    const item = await State.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'State updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await City.deleteMany({ stateId: id });
    await State.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'State and cascaded cities deleted successfully' });
  } catch (error) { next(error); }
};

// City Controllers
export const getCities = async (req: Request, res: Response, next: NextFunction) => {
  const customFilter: any = {};
  if (req.query.stateId) {
    customFilter.stateId = req.query.stateId;
  }
  await handlePagedRequest(res, City, req.query, ['name'], ['stateId'], customFilter);
};
export const createCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = citySchema.parse(req.body);
    const item = await City.create(data);
    res.status(201).json({ success: true, message: 'City created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = citySchema.partial().parse(req.body);
    const item = await City.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'City updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'City deleted successfully' });
  } catch (error) { next(error); }
};

// Currency Controllers
export const getCurrencies = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Currency, req.query, ['name', 'code', 'symbol']);
};
export const createCurrency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = currencySchema.parse(req.body);
    const item = await Currency.create(data);
    res.status(201).json({ success: true, message: 'Currency created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateCurrency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = currencySchema.partial().parse(req.body);
    const item = await Currency.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Currency updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteCurrency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Currency.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Currency deleted successfully' });
  } catch (error) { next(error); }
};

// Login Logs
export const getLoginLogs = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, LoginAttemptLog, req.query, ['email', 'ip', 'userAgent', 'status']);
};

// =============================================================================
// WEBSITE DYNAMIC MASTER SCHEMAS AND CONTROLLERS
// =============================================================================

const categoryMasterSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  badge: z.string().min(2),
  description: z.string().min(2),
  imageKey: z.string().min(2),
  imageAlt: z.string().optional().default(''),
  isActive: z.boolean().default(true)
});

const productMasterSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  brand: z.string().min(2),
  categoryId: z.string().min(2),
  imageKey: z.string().min(2),
  imageAlt: z.string().optional().default(''),
  longDescription: z.string().min(2),
  applications: z.string().optional().default(''),
  specs: z.array(z.string()).default([]),
  liveSpecs: z.array(z.string()).default([]),
  attributes: z.record(z.string()).default({}),
  isActive: z.boolean().default(true)
});

const testimonialMasterSchema = z.object({
  client: z.string().min(2),
  company: z.string().min(2),
  feedback: z.string().min(2),
  isActive: z.boolean().default(true)
});

const faqMasterSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  order: z.number().default(0),
  isActive: z.boolean().default(true)
});

const blogMasterSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(2),
  content: z.string().min(2),
  author: z.string().default('Shree Raj Traders Admin'),
  date: z.string().min(2),
  readTime: z.string().default('5 min read'),
  imageKey: z.string().min(2),
  imageAlt: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true)
});

// Category Master
export const getCategoryMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Category, req.query, ['id', 'title', 'badge', 'description']);
};
export const createCategoryMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = categoryMasterSchema.parse(req.body);
    const item = await Category.create(data);
    res.status(201).json({ success: true, message: 'Category created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateCategoryMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = categoryMasterSchema.partial().parse(req.body);
    const item = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Category updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteCategoryMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) { next(error); }
};

// Product Master
export const getProductMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Product, req.query, ['slug', 'name', 'brand', 'categoryId', 'longDescription']);
};
export const createProductMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = productMasterSchema.parse(req.body);
    const item = await Product.create(data);
    res.status(201).json({ success: true, message: 'Product created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateProductMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = productMasterSchema.partial().parse(req.body);
    const item = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Product updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteProductMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) { next(error); }
};

// Testimonial Master
export const getTestimonialMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Testimonial, req.query, ['client', 'company', 'feedback']);
};
export const createTestimonialMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = testimonialMasterSchema.parse(req.body);
    const item = await Testimonial.create(data);
    res.status(201).json({ success: true, message: 'Testimonial created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateTestimonialMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = testimonialMasterSchema.partial().parse(req.body);
    const item = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteTestimonialMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) { next(error); }
};

// FAQ Master
export const getFAQMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, FAQ, req.query, ['question', 'answer']);
};
export const createFAQMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = faqMasterSchema.parse(req.body);
    const item = await FAQ.create(data);
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateFAQMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = faqMasterSchema.partial().parse(req.body);
    const item = await FAQ.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'FAQ updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteFAQMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) { next(error); }
};

// Blog Master
export const getBlogMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Blog, req.query, ['title', 'slug', 'excerpt', 'author']);
};
export const createBlogMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = blogMasterSchema.parse(req.body);
    const item = await Blog.create(data);
    res.status(201).json({ success: true, message: 'Blog created successfully', data: item });
  } catch (error) { next(error); }
};
export const updateBlogMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = blogMasterSchema.partial().parse(req.body);
    const item = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, message: 'Blog updated successfully', data: item });
  } catch (error) { next(error); }
};
export const deleteBlogMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) { next(error); }
};

// Inquiry (RFQ) Master - Read/Delete Only
export const getInquiryMaster = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagedRequest(res, Inquiry, req.query, ['name', 'email', 'company', 'productName', 'phone', 'message']);
};
export const deleteInquiryMaster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) { next(error); }
};
