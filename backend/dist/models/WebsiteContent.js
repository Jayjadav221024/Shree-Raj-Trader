"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inquiry = exports.Blog = exports.FAQ = exports.Testimonial = exports.Product = exports.Category = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CategorySchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    badge: { type: String, required: true },
    description: { type: String, required: true },
    imageKey: { type: String, required: true },
    // Screen-reader / SEO description of the picture. Blank falls back to the title.
    imageAlt: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.Category = mongoose_1.default.model('Category', CategorySchema);
const ProductSchema = new mongoose_1.Schema({
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
    attributes: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
const TestimonialSchema = new mongoose_1.Schema({
    client: { type: String, required: true },
    company: { type: String, required: true },
    feedback: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.Testimonial = mongoose_1.default.model('Testimonial', TestimonialSchema);
const FAQSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.FAQ = mongoose_1.default.model('FAQ', FAQSchema);
const BlogSchema = new mongoose_1.Schema({
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
exports.Blog = mongoose_1.default.model('Blog', BlogSchema);
const InquirySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    message: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
exports.Inquiry = mongoose_1.default.model('Inquiry', InquirySchema);
