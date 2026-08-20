"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const siteSectionController_1 = require("../controllers/siteSectionController");
const careerController_1 = require("../controllers/careerController");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.get('/categories', publicController_1.getPublicCategories);
router.get('/products', publicController_1.getPublicProducts);
router.get('/testimonials', publicController_1.getPublicTestimonials);
router.get('/faqs', publicController_1.getPublicFAQs);
router.get('/blogs', publicController_1.getPublicBlogs);
router.get('/blogs/:slug', publicController_1.getPublicBlogBySlug);
router.post('/inquiries', publicController_1.createPublicInquiry);
// Editable website copy (Website Editor overrides). Public so the site itself can read it.
router.get('/site-content', siteSectionController_1.getPublicSiteContent);
// Careers page (/career/) — unlisted, but its data is served like any other page.
router.get('/careers', careerController_1.getPublicJobOpenings);
router.post('/job-applications', careerController_1.createPublicJobApplication);
router.post('/upload/resume', uploadController_1.uploadDocument.single('document'), uploadController_1.handleDocumentUpload);
exports.default = router;
