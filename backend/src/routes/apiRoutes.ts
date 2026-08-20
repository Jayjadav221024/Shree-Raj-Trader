import { Router } from 'express';
import { authenticate, checkPermission } from '../middlewares/auth';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../controllers/adminUserController';
import {
  getRolePermissions,
  saveRolePermissions
} from '../controllers/rolePermissionController';
import {
  getRoles, createRole, updateRole, deleteRole,
  getMenuGroups, createMenuGroup, updateMenuGroup, deleteMenuGroup,
  getMenus, createMenu, updateMenu, deleteMenu,
  getCountries, createCountry, updateCountry, deleteCountry,
  getStates, createState, updateState, deleteState,
  getCities, createCity, updateCity, deleteCity,
  getCurrencies, createCurrency, updateCurrency, deleteCurrency,
  getLoginLogs,
  getCategoryMaster, createCategoryMaster, updateCategoryMaster, deleteCategoryMaster,
  getProductMaster, createProductMaster, updateProductMaster, deleteProductMaster,
  getTestimonialMaster, createTestimonialMaster, updateTestimonialMaster, deleteTestimonialMaster,
  getFAQMaster, createFAQMaster, updateFAQMaster, deleteFAQMaster,
  getBlogMaster, createBlogMaster, updateBlogMaster, deleteBlogMaster,
  getInquiryMaster, deleteInquiryMaster
} from '../controllers/masterController';
import {
  getEmailSetup, saveEmailSetup,
  getEmailForList, createEmailFor, updateEmailFor, deleteEmailFor,
  getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate,
  testSendEmail
} from '../controllers/cmsController';
import {
  getSiteSections,
  saveSiteSection,
  resetSiteSection
} from '../controllers/siteSectionController';
import {
  getJobOpeningMaster,
  createJobOpeningMaster,
  updateJobOpeningMaster,
  deleteJobOpeningMaster,
  getJobApplicationMaster,
  updateJobApplicationMaster,
  deleteJobApplicationMaster
} from '../controllers/careerController';
import { upload, handleImageUpload } from '../controllers/uploadController';

/** Menu route the Website Editor screen is registered under (see seed.ts). */
const WEBSITE_EDITOR_ROUTE = '/admin/website/editor';

const router = Router();

router.use(authenticate);

// 0. File Uploads (Authenticated)
router.post('/upload/image', upload.single('image'), handleImageUpload);

// 1. Admin Users
router.get('/admin-users', checkPermission('/setup/admin-users', 'canView'), getAdminUsers);
router.post('/admin-users', checkPermission('/setup/admin-users', 'canCreate'), createAdminUser);
router.put('/admin-users/:id', checkPermission('/setup/admin-users', 'canEdit'), updateAdminUser);
router.delete('/admin-users/:id', checkPermission('/setup/admin-users', 'canDelete'), deleteAdminUser);

// 2. Role Permissions Matrix
router.get('/role-permissions/:roleId', checkPermission('/setup/user-roles', 'canView'), getRolePermissions);
router.post('/role-permissions', checkPermission('/setup/user-roles', 'canEdit'), saveRolePermissions);

// 3. Masters
// Role Master
router.get('/roles', checkPermission('/master/role', 'canView'), getRoles);
router.post('/roles', checkPermission('/master/role', 'canCreate'), createRole);
router.put('/roles/:id', checkPermission('/master/role', 'canEdit'), updateRole);
router.delete('/roles/:id', checkPermission('/master/role', 'canDelete'), deleteRole);

// Menu Group
router.get('/menu-groups', checkPermission('/master/menu-group', 'canView'), getMenuGroups);
router.post('/menu-groups', checkPermission('/master/menu-group', 'canCreate'), createMenuGroup);
router.put('/menu-groups/:id', checkPermission('/master/menu-group', 'canEdit'), updateMenuGroup);
router.delete('/menu-groups/:id', checkPermission('/master/menu-group', 'canDelete'), deleteMenuGroup);

// Menu Master
router.get('/menu-master', checkPermission('/master/menu-master', 'canView'), getMenus);
router.post('/menu-master', checkPermission('/master/menu-master', 'canCreate'), createMenu);
router.put('/menu-master/:id', checkPermission('/master/menu-master', 'canEdit'), updateMenu);
router.delete('/menu-master/:id', checkPermission('/master/menu-master', 'canDelete'), deleteMenu);

// Country
router.get('/countries', checkPermission('/master/country', 'canView'), getCountries);
router.post('/countries', checkPermission('/master/country', 'canCreate'), createCountry);
router.put('/countries/:id', checkPermission('/master/country', 'canEdit'), updateCountry);
router.delete('/countries/:id', checkPermission('/master/country', 'canDelete'), deleteCountry);

// State
router.get('/states', checkPermission('/master/state', 'canView'), getStates);
router.post('/states', checkPermission('/master/state', 'canCreate'), createState);
router.put('/states/:id', checkPermission('/master/state', 'canEdit'), updateState);
router.delete('/states/:id', checkPermission('/master/state', 'canDelete'), deleteState);

// City
router.get('/cities', checkPermission('/master/city', 'canView'), getCities);
router.post('/cities', checkPermission('/master/city', 'canCreate'), createCity);
router.put('/cities/:id', checkPermission('/master/city', 'canEdit'), updateCity);
router.delete('/cities/:id', checkPermission('/master/city', 'canDelete'), deleteCity);

// Currency
router.get('/currencies', checkPermission('/master/currency', 'canView'), getCurrencies);
router.post('/currencies', checkPermission('/master/currency', 'canCreate'), createCurrency);
router.put('/currencies/:id', checkPermission('/master/currency', 'canEdit'), updateCurrency);
router.delete('/currencies/:id', checkPermission('/master/currency', 'canDelete'), deleteCurrency);

// Login Logs
router.get('/login-logs', checkPermission('/master/login-logs', 'canView'), getLoginLogs);

// Website Dynamic Master Routes
// Category
router.get('/categories-master', checkPermission('/master/category', 'canView'), getCategoryMaster);
router.post('/categories-master', checkPermission('/master/category', 'canCreate'), createCategoryMaster);
router.put('/categories-master/:id', checkPermission('/master/category', 'canEdit'), updateCategoryMaster);
router.delete('/categories-master/:id', checkPermission('/master/category', 'canDelete'), deleteCategoryMaster);

// Product
router.get('/products-master', checkPermission('/master/product', 'canView'), getProductMaster);
router.post('/products-master', checkPermission('/master/product', 'canCreate'), createProductMaster);
router.put('/products-master/:id', checkPermission('/master/product', 'canEdit'), updateProductMaster);
router.delete('/products-master/:id', checkPermission('/master/product', 'canDelete'), deleteProductMaster);

// Testimonial
router.get('/testimonials-master', checkPermission('/master/testimonial', 'canView'), getTestimonialMaster);
router.post('/testimonials-master', checkPermission('/master/testimonial', 'canCreate'), createTestimonialMaster);
router.put('/testimonials-master/:id', checkPermission('/master/testimonial', 'canEdit'), updateTestimonialMaster);
router.delete('/testimonials-master/:id', checkPermission('/master/testimonial', 'canDelete'), deleteTestimonialMaster);

// FAQ
router.get('/faqs-master', checkPermission('/master/faq', 'canView'), getFAQMaster);
router.post('/faqs-master', checkPermission('/master/faq', 'canCreate'), createFAQMaster);
router.put('/faqs-master/:id', checkPermission('/master/faq', 'canEdit'), updateFAQMaster);
router.delete('/faqs-master/:id', checkPermission('/master/faq', 'canDelete'), deleteFAQMaster);

// Blog
router.get('/blogs-master', checkPermission('/master/blog', 'canView'), getBlogMaster);
router.post('/blogs-master', checkPermission('/master/blog', 'canCreate'), createBlogMaster);
router.put('/blogs-master/:id', checkPermission('/master/blog', 'canEdit'), updateBlogMaster);
router.delete('/blogs-master/:id', checkPermission('/master/blog', 'canDelete'), deleteBlogMaster);

// Inquiry (RFQs)
router.get('/inquiries-master', checkPermission('/master/inquiry', 'canView'), getInquiryMaster);
router.delete('/inquiries-master/:id', checkPermission('/master/inquiry', 'canDelete'), deleteInquiryMaster);

// Careers (the unlisted /career/ page)
router.get('/job-openings', checkPermission('/admin/master/job-opening', 'canView'), getJobOpeningMaster);
router.post('/job-openings', checkPermission('/admin/master/job-opening', 'canCreate'), createJobOpeningMaster);
router.put('/job-openings/:id', checkPermission('/admin/master/job-opening', 'canEdit'), updateJobOpeningMaster);
router.delete('/job-openings/:id', checkPermission('/admin/master/job-opening', 'canDelete'), deleteJobOpeningMaster);

router.get('/job-applications', checkPermission('/admin/master/job-application', 'canView'), getJobApplicationMaster);
router.put('/job-applications/:id', checkPermission('/admin/master/job-application', 'canEdit'), updateJobApplicationMaster);
router.delete('/job-applications/:id', checkPermission('/admin/master/job-application', 'canDelete'), deleteJobApplicationMaster);

// Website Editor — live copy/images for every section of the public site
router.get('/site-sections', checkPermission(WEBSITE_EDITOR_ROUTE, 'canView'), getSiteSections);
router.put('/site-sections/:key', checkPermission(WEBSITE_EDITOR_ROUTE, 'canEdit'), saveSiteSection);
router.delete('/site-sections/:key', checkPermission(WEBSITE_EDITOR_ROUTE, 'canDelete'), resetSiteSection);

// 4. CMS Section
// Email Setup SMTP
router.get('/cms/email-setup', checkPermission('/cms/email-setup', 'canView'), getEmailSetup);
router.post('/cms/email-setup', checkPermission('/cms/email-setup', 'canEdit'), saveEmailSetup);

// Email For Event mappings
router.get('/cms/email-for', checkPermission('/cms/email-for', 'canView'), getEmailForList);
router.post('/cms/email-for', checkPermission('/cms/email-for', 'canCreate'), createEmailFor);
router.put('/cms/email-for/:id', checkPermission('/cms/email-for', 'canEdit'), updateEmailFor);
router.delete('/cms/email-for/:id', checkPermission('/cms/email-for', 'canDelete'), deleteEmailFor);

// Email Templates
router.get('/cms/email-templates', checkPermission('/cms/email-template', 'canView'), getEmailTemplates);
router.post('/cms/email-templates', checkPermission('/cms/email-template', 'canCreate'), createEmailTemplate);
router.put('/cms/email-templates/:id', checkPermission('/cms/email-template', 'canEdit'), updateEmailTemplate);
router.delete('/cms/email-templates/:id', checkPermission('/cms/email-template', 'canDelete'), deleteEmailTemplate);
router.post('/cms/test-send', checkPermission('/cms/email-template', 'canEdit'), testSendEmail);

export default router;
