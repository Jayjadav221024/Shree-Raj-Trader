"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInquiryMaster = exports.deleteBlogMaster = exports.updateBlogMaster = exports.createBlogMaster = exports.getBlogMaster = exports.deleteFAQMaster = exports.updateFAQMaster = exports.createFAQMaster = exports.getFAQMaster = exports.deleteTestimonialMaster = exports.updateTestimonialMaster = exports.createTestimonialMaster = exports.getTestimonialMaster = exports.deleteProductMaster = exports.updateProductMaster = exports.createProductMaster = exports.getProductMaster = exports.deleteCategoryMaster = exports.updateCategoryMaster = exports.createCategoryMaster = exports.getCategoryMaster = exports.getLoginLogs = exports.deleteCurrency = exports.updateCurrency = exports.createCurrency = exports.getCurrencies = exports.deleteCity = exports.updateCity = exports.createCity = exports.getCities = exports.deleteState = exports.updateState = exports.createState = exports.getStates = exports.deleteCountry = exports.updateCountry = exports.createCountry = exports.getCountries = exports.deleteMenu = exports.updateMenu = exports.createMenu = exports.getMenus = exports.deleteMenuGroup = exports.updateMenuGroup = exports.createMenuGroup = exports.getMenuGroups = exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoles = void 0;
exports.deleteInquiryMaster = void 0;
const zod_1 = require("zod");
const RoleMaster_1 = __importDefault(require("../models/RoleMaster"));
const MenuGroup_1 = __importDefault(require("../models/MenuGroup"));
const MenuMaster_1 = __importDefault(require("../models/MenuMaster"));
const Geography_1 = require("../models/Geography");
const Currency_1 = __importDefault(require("../models/Currency"));
const LoginAttemptLog_1 = __importDefault(require("../models/LoginAttemptLog"));
const WebsiteContent_1 = require("../models/WebsiteContent");
const apiHelper_1 = require("../utils/apiHelper");
const roleSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(2),
    isActive: zod_1.z.boolean().default(true)
});
const menuGroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    order: zod_1.z.number().default(0),
    isActive: zod_1.z.boolean().default(true)
});
const menuMasterSchema = zod_1.z.object({
    label: zod_1.z.string().min(2),
    icon: zod_1.z.string(),
    route: zod_1.z.string(),
    parentId: zod_1.z.string().nullable().optional(),
    menuGroupId: zod_1.z.string(),
    order: zod_1.z.number().default(0),
    isActive: zod_1.z.boolean().default(true)
});
const countrySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    code: zod_1.z.string().min(2),
    isActive: zod_1.z.boolean().default(true)
});
const stateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    countryId: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true)
});
const citySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    stateId: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true)
});
const currencySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    code: zod_1.z.string().min(2),
    symbol: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true)
});
// Role Master Controllers
const getRoles = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, RoleMaster_1.default, req.query, ['name', 'description']);
};
exports.getRoles = getRoles;
const createRole = async (req, res, next) => {
    try {
        const data = roleSchema.parse(req.body);
        const item = await RoleMaster_1.default.create(data);
        res.status(201).json({ success: true, message: 'Role created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createRole = createRole;
const updateRole = async (req, res, next) => {
    try {
        const data = roleSchema.partial().parse(req.body);
        const item = await RoleMaster_1.default.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Role updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res, next) => {
    try {
        await RoleMaster_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Role deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRole = deleteRole;
// Menu Group Controllers
const getMenuGroups = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, MenuGroup_1.default, req.query, ['name']);
};
exports.getMenuGroups = getMenuGroups;
const createMenuGroup = async (req, res, next) => {
    try {
        const data = menuGroupSchema.parse(req.body);
        const item = await MenuGroup_1.default.create(data);
        res.status(201).json({ success: true, message: 'Menu Group created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createMenuGroup = createMenuGroup;
const updateMenuGroup = async (req, res, next) => {
    try {
        const data = menuGroupSchema.partial().parse(req.body);
        const item = await MenuGroup_1.default.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Menu Group updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMenuGroup = updateMenuGroup;
const deleteMenuGroup = async (req, res, next) => {
    try {
        await MenuGroup_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Menu Group deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMenuGroup = deleteMenuGroup;
// Menu Master Controllers
const getMenus = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, MenuMaster_1.default, req.query, ['label', 'route'], ['menuGroupId', 'parentId']);
};
exports.getMenus = getMenus;
const createMenu = async (req, res, next) => {
    try {
        const data = menuMasterSchema.parse(req.body);
        const item = await MenuMaster_1.default.create(data);
        res.status(201).json({ success: true, message: 'Menu created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createMenu = createMenu;
const updateMenu = async (req, res, next) => {
    try {
        const data = menuMasterSchema.partial().parse(req.body);
        const item = await MenuMaster_1.default.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Menu updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMenu = updateMenu;
const deleteMenu = async (req, res, next) => {
    try {
        await MenuMaster_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Menu deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMenu = deleteMenu;
// Country Controllers
const getCountries = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, Geography_1.Country, req.query, ['name', 'code']);
};
exports.getCountries = getCountries;
const createCountry = async (req, res, next) => {
    try {
        const data = countrySchema.parse(req.body);
        const item = await Geography_1.Country.create(data);
        res.status(201).json({ success: true, message: 'Country created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createCountry = createCountry;
const updateCountry = async (req, res, next) => {
    try {
        const data = countrySchema.partial().parse(req.body);
        const item = await Geography_1.Country.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Country updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCountry = updateCountry;
const deleteCountry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const states = await Geography_1.State.find({ countryId: id });
        const stateIds = states.map(s => s._id);
        await Geography_1.City.deleteMany({ stateId: { $in: stateIds } });
        await Geography_1.State.deleteMany({ countryId: id });
        await Geography_1.Country.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Country and cascaded states/cities deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCountry = deleteCountry;
// State Controllers
const getStates = async (req, res, next) => {
    const customFilter = {};
    if (req.query.countryId) {
        customFilter.countryId = req.query.countryId;
    }
    await (0, apiHelper_1.handlePagedRequest)(res, Geography_1.State, req.query, ['name'], ['countryId'], customFilter);
};
exports.getStates = getStates;
const createState = async (req, res, next) => {
    try {
        const data = stateSchema.parse(req.body);
        const item = await Geography_1.State.create(data);
        res.status(201).json({ success: true, message: 'State created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createState = createState;
const updateState = async (req, res, next) => {
    try {
        const data = stateSchema.partial().parse(req.body);
        const item = await Geography_1.State.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'State updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateState = updateState;
const deleteState = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Geography_1.City.deleteMany({ stateId: id });
        await Geography_1.State.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'State and cascaded cities deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteState = deleteState;
// City Controllers
const getCities = async (req, res, next) => {
    const customFilter = {};
    if (req.query.stateId) {
        customFilter.stateId = req.query.stateId;
    }
    await (0, apiHelper_1.handlePagedRequest)(res, Geography_1.City, req.query, ['name'], ['stateId'], customFilter);
};
exports.getCities = getCities;
const createCity = async (req, res, next) => {
    try {
        const data = citySchema.parse(req.body);
        const item = await Geography_1.City.create(data);
        res.status(201).json({ success: true, message: 'City created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createCity = createCity;
const updateCity = async (req, res, next) => {
    try {
        const data = citySchema.partial().parse(req.body);
        const item = await Geography_1.City.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'City updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCity = updateCity;
const deleteCity = async (req, res, next) => {
    try {
        await Geography_1.City.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'City deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCity = deleteCity;
// Currency Controllers
const getCurrencies = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, Currency_1.default, req.query, ['name', 'code', 'symbol']);
};
exports.getCurrencies = getCurrencies;
const createCurrency = async (req, res, next) => {
    try {
        const data = currencySchema.parse(req.body);
        const item = await Currency_1.default.create(data);
        res.status(201).json({ success: true, message: 'Currency created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createCurrency = createCurrency;
const updateCurrency = async (req, res, next) => {
    try {
        const data = currencySchema.partial().parse(req.body);
        const item = await Currency_1.default.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Currency updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCurrency = updateCurrency;
const deleteCurrency = async (req, res, next) => {
    try {
        await Currency_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Currency deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCurrency = deleteCurrency;
// Login Logs
const getLoginLogs = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, LoginAttemptLog_1.default, req.query, ['email', 'ip', 'userAgent', 'status']);
};
exports.getLoginLogs = getLoginLogs;
// =============================================================================
// WEBSITE DYNAMIC MASTER SCHEMAS AND CONTROLLERS
// =============================================================================
const categoryMasterSchema = zod_1.z.object({
    id: zod_1.z.string().min(2),
    title: zod_1.z.string().min(2),
    badge: zod_1.z.string().min(2),
    description: zod_1.z.string().min(2),
    imageKey: zod_1.z.string().min(2),
    imageAlt: zod_1.z.string().optional().default(''),
    isActive: zod_1.z.boolean().default(true)
});
const productMasterSchema = zod_1.z.object({
    slug: zod_1.z.string().min(2),
    name: zod_1.z.string().min(2),
    brand: zod_1.z.string().min(2),
    categoryId: zod_1.z.string().min(2),
    imageKey: zod_1.z.string().min(2),
    imageAlt: zod_1.z.string().optional().default(''),
    longDescription: zod_1.z.string().min(2),
    applications: zod_1.z.string().optional().default(''),
    specs: zod_1.z.array(zod_1.z.string()).default([]),
    liveSpecs: zod_1.z.array(zod_1.z.string()).default([]),
    attributes: zod_1.z.record(zod_1.z.string()).default({}),
    isActive: zod_1.z.boolean().default(true)
});
const testimonialMasterSchema = zod_1.z.object({
    client: zod_1.z.string().min(2),
    company: zod_1.z.string().min(2),
    feedback: zod_1.z.string().min(2),
    isActive: zod_1.z.boolean().default(true)
});
const faqMasterSchema = zod_1.z.object({
    question: zod_1.z.string().min(2),
    answer: zod_1.z.string().min(2),
    order: zod_1.z.number().default(0),
    isActive: zod_1.z.boolean().default(true)
});
const blogMasterSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2),
    excerpt: zod_1.z.string().min(2),
    content: zod_1.z.string().min(2),
    author: zod_1.z.string().default('Shree Raj Traders Admin'),
    date: zod_1.z.string().min(2),
    readTime: zod_1.z.string().default('5 min read'),
    imageKey: zod_1.z.string().min(2),
    imageAlt: zod_1.z.string().optional().default(''),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    isActive: zod_1.z.boolean().default(true)
});
// Category Master
const getCategoryMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.Category, req.query, ['id', 'title', 'badge', 'description']);
};
exports.getCategoryMaster = getCategoryMaster;
const createCategoryMaster = async (req, res, next) => {
    try {
        const data = categoryMasterSchema.parse(req.body);
        const item = await WebsiteContent_1.Category.create(data);
        res.status(201).json({ success: true, message: 'Category created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategoryMaster = createCategoryMaster;
const updateCategoryMaster = async (req, res, next) => {
    try {
        const data = categoryMasterSchema.partial().parse(req.body);
        const item = await WebsiteContent_1.Category.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Category updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategoryMaster = updateCategoryMaster;
const deleteCategoryMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategoryMaster = deleteCategoryMaster;
// Product Master
const getProductMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.Product, req.query, ['slug', 'name', 'brand', 'categoryId', 'longDescription']);
};
exports.getProductMaster = getProductMaster;
const createProductMaster = async (req, res, next) => {
    try {
        const data = productMasterSchema.parse(req.body);
        const item = await WebsiteContent_1.Product.create(data);
        res.status(201).json({ success: true, message: 'Product created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createProductMaster = createProductMaster;
const updateProductMaster = async (req, res, next) => {
    try {
        const data = productMasterSchema.partial().parse(req.body);
        const item = await WebsiteContent_1.Product.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Product updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductMaster = updateProductMaster;
const deleteProductMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProductMaster = deleteProductMaster;
// Testimonial Master
const getTestimonialMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.Testimonial, req.query, ['client', 'company', 'feedback']);
};
exports.getTestimonialMaster = getTestimonialMaster;
const createTestimonialMaster = async (req, res, next) => {
    try {
        const data = testimonialMasterSchema.parse(req.body);
        const item = await WebsiteContent_1.Testimonial.create(data);
        res.status(201).json({ success: true, message: 'Testimonial created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createTestimonialMaster = createTestimonialMaster;
const updateTestimonialMaster = async (req, res, next) => {
    try {
        const data = testimonialMasterSchema.partial().parse(req.body);
        const item = await WebsiteContent_1.Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTestimonialMaster = updateTestimonialMaster;
const deleteTestimonialMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTestimonialMaster = deleteTestimonialMaster;
// FAQ Master
const getFAQMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.FAQ, req.query, ['question', 'answer']);
};
exports.getFAQMaster = getFAQMaster;
const createFAQMaster = async (req, res, next) => {
    try {
        const data = faqMasterSchema.parse(req.body);
        const item = await WebsiteContent_1.FAQ.create(data);
        res.status(201).json({ success: true, message: 'FAQ created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createFAQMaster = createFAQMaster;
const updateFAQMaster = async (req, res, next) => {
    try {
        const data = faqMasterSchema.partial().parse(req.body);
        const item = await WebsiteContent_1.FAQ.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'FAQ updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateFAQMaster = updateFAQMaster;
const deleteFAQMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFAQMaster = deleteFAQMaster;
// Blog Master
const getBlogMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.Blog, req.query, ['title', 'slug', 'excerpt', 'author']);
};
exports.getBlogMaster = getBlogMaster;
const createBlogMaster = async (req, res, next) => {
    try {
        const data = blogMasterSchema.parse(req.body);
        const item = await WebsiteContent_1.Blog.create(data);
        res.status(201).json({ success: true, message: 'Blog created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createBlogMaster = createBlogMaster;
const updateBlogMaster = async (req, res, next) => {
    try {
        const data = blogMasterSchema.partial().parse(req.body);
        const item = await WebsiteContent_1.Blog.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Blog updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBlogMaster = updateBlogMaster;
const deleteBlogMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBlogMaster = deleteBlogMaster;
// Inquiry (RFQ) Master - Read/Delete Only
const getInquiryMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, WebsiteContent_1.Inquiry, req.query, ['name', 'email', 'company', 'productName', 'phone', 'message']);
};
exports.getInquiryMaster = getInquiryMaster;
const deleteInquiryMaster = async (req, res, next) => {
    try {
        await WebsiteContent_1.Inquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteInquiryMaster = deleteInquiryMaster;
