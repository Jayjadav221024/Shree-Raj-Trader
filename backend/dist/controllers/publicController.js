"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicInquiry = exports.getPublicBlogBySlug = exports.getPublicBlogs = exports.getPublicFAQs = exports.getPublicTestimonials = exports.getPublicProducts = exports.getPublicCategories = void 0;
const WebsiteContent_1 = require("../models/WebsiteContent");
const zod_1 = require("zod");
const inquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().min(5),
    company: zod_1.z.string().optional().default('General Lead'),
    productName: zod_1.z.string().min(1),
    quantity: zod_1.z.number().min(1).default(1),
    message: zod_1.z.string().optional().default('')
});
const getPublicCategories = async (req, res, next) => {
    try {
        const items = await WebsiteContent_1.Category.find({ isActive: true });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicCategories = getPublicCategories;
const getPublicProducts = async (req, res, next) => {
    try {
        const items = await WebsiteContent_1.Product.find({ isActive: true });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicProducts = getPublicProducts;
const getPublicTestimonials = async (req, res, next) => {
    try {
        const items = await WebsiteContent_1.Testimonial.find({ isActive: true });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicTestimonials = getPublicTestimonials;
const getPublicFAQs = async (req, res, next) => {
    try {
        const items = await WebsiteContent_1.FAQ.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicFAQs = getPublicFAQs;
const getPublicBlogs = async (req, res, next) => {
    try {
        const items = await WebsiteContent_1.Blog.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicBlogs = getPublicBlogs;
const getPublicBlogBySlug = async (req, res, next) => {
    try {
        const item = await WebsiteContent_1.Blog.findOne({ slug: req.params.slug, isActive: true });
        if (!item) {
            res.status(404).json({ success: false, message: 'Blog post not found' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicBlogBySlug = getPublicBlogBySlug;
const createPublicInquiry = async (req, res, next) => {
    try {
        const data = inquirySchema.parse(req.body);
        const item = await WebsiteContent_1.Inquiry.create(data);
        res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createPublicInquiry = createPublicInquiry;
