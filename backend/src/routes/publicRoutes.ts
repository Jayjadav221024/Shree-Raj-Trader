import { Router } from 'express';
import {
  getPublicCategories,
  getPublicProducts,
  getPublicTestimonials,
  getPublicFAQs,
  getPublicBlogs,
  getPublicBlogBySlug,
  createPublicInquiry
} from '../controllers/publicController';
import { getPublicSiteContent } from '../controllers/siteSectionController';
import { getPublicJobOpenings, createPublicJobApplication } from '../controllers/careerController';
import { uploadDocument, handleDocumentUpload } from '../controllers/uploadController';

const router = Router();

router.get('/categories', getPublicCategories);
router.get('/products', getPublicProducts);
router.get('/testimonials', getPublicTestimonials);
router.get('/faqs', getPublicFAQs);
router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getPublicBlogBySlug);
router.post('/inquiries', createPublicInquiry);

// Editable website copy (Website Editor overrides). Public so the site itself can read it.
router.get('/site-content', getPublicSiteContent);

// Careers page (/career/) — unlisted, but its data is served like any other page.
router.get('/careers', getPublicJobOpenings);
router.post('/job-applications', createPublicJobApplication);
router.post('/upload/resume', uploadDocument.single('document'), handleDocumentUpload);

export default router;
