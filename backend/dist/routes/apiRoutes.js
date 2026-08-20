"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const adminUserController_1 = require("../controllers/adminUserController");
const rolePermissionController_1 = require("../controllers/rolePermissionController");
const masterController_1 = require("../controllers/masterController");
const cmsController_1 = require("../controllers/cmsController");
const siteSectionController_1 = require("../controllers/siteSectionController");
const careerController_1 = require("../controllers/careerController");
const uploadController_1 = require("../controllers/uploadController");
/** Menu route the Website Editor screen is registered under (see seed.ts). */
const WEBSITE_EDITOR_ROUTE = '/admin/website/editor';
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// 0. File Uploads (Authenticated)
router.post('/upload/image', uploadController_1.upload.single('image'), uploadController_1.handleImageUpload);
// 1. Admin Users
router.get('/admin-users', (0, auth_1.checkPermission)('/setup/admin-users', 'canView'), adminUserController_1.getAdminUsers);
router.post('/admin-users', (0, auth_1.checkPermission)('/setup/admin-users', 'canCreate'), adminUserController_1.createAdminUser);
router.put('/admin-users/:id', (0, auth_1.checkPermission)('/setup/admin-users', 'canEdit'), adminUserController_1.updateAdminUser);
router.delete('/admin-users/:id', (0, auth_1.checkPermission)('/setup/admin-users', 'canDelete'), adminUserController_1.deleteAdminUser);
// 2. Role Permissions Matrix
router.get('/role-permissions/:roleId', (0, auth_1.checkPermission)('/setup/user-roles', 'canView'), rolePermissionController_1.getRolePermissions);
router.post('/role-permissions', (0, auth_1.checkPermission)('/setup/user-roles', 'canEdit'), rolePermissionController_1.saveRolePermissions);
// 3. Masters
// Role Master
router.get('/roles', (0, auth_1.checkPermission)('/master/role', 'canView'), masterController_1.getRoles);
router.post('/roles', (0, auth_1.checkPermission)('/master/role', 'canCreate'), masterController_1.createRole);
router.put('/roles/:id', (0, auth_1.checkPermission)('/master/role', 'canEdit'), masterController_1.updateRole);
router.delete('/roles/:id', (0, auth_1.checkPermission)('/master/role', 'canDelete'), masterController_1.deleteRole);
// Menu Group
router.get('/menu-groups', (0, auth_1.checkPermission)('/master/menu-group', 'canView'), masterController_1.getMenuGroups);
router.post('/menu-groups', (0, auth_1.checkPermission)('/master/menu-group', 'canCreate'), masterController_1.createMenuGroup);
router.put('/menu-groups/:id', (0, auth_1.checkPermission)('/master/menu-group', 'canEdit'), masterController_1.updateMenuGroup);
router.delete('/menu-groups/:id', (0, auth_1.checkPermission)('/master/menu-group', 'canDelete'), masterController_1.deleteMenuGroup);
// Menu Master
router.get('/menu-master', (0, auth_1.checkPermission)('/master/menu-master', 'canView'), masterController_1.getMenus);
router.post('/menu-master', (0, auth_1.checkPermission)('/master/menu-master', 'canCreate'), masterController_1.createMenu);
router.put('/menu-master/:id', (0, auth_1.checkPermission)('/master/menu-master', 'canEdit'), masterController_1.updateMenu);
router.delete('/menu-master/:id', (0, auth_1.checkPermission)('/master/menu-master', 'canDelete'), masterController_1.deleteMenu);
// Country
router.get('/countries', (0, auth_1.checkPermission)('/master/country', 'canView'), masterController_1.getCountries);
router.post('/countries', (0, auth_1.checkPermission)('/master/country', 'canCreate'), masterController_1.createCountry);
router.put('/countries/:id', (0, auth_1.checkPermission)('/master/country', 'canEdit'), masterController_1.updateCountry);
router.delete('/countries/:id', (0, auth_1.checkPermission)('/master/country', 'canDelete'), masterController_1.deleteCountry);
// State
router.get('/states', (0, auth_1.checkPermission)('/master/state', 'canView'), masterController_1.getStates);
router.post('/states', (0, auth_1.checkPermission)('/master/state', 'canCreate'), masterController_1.createState);
router.put('/states/:id', (0, auth_1.checkPermission)('/master/state', 'canEdit'), masterController_1.updateState);
router.delete('/states/:id', (0, auth_1.checkPermission)('/master/state', 'canDelete'), masterController_1.deleteState);
// City
router.get('/cities', (0, auth_1.checkPermission)('/master/city', 'canView'), masterController_1.getCities);
router.post('/cities', (0, auth_1.checkPermission)('/master/city', 'canCreate'), masterController_1.createCity);
router.put('/cities/:id', (0, auth_1.checkPermission)('/master/city', 'canEdit'), masterController_1.updateCity);
router.delete('/cities/:id', (0, auth_1.checkPermission)('/master/city', 'canDelete'), masterController_1.deleteCity);
// Currency
router.get('/currencies', (0, auth_1.checkPermission)('/master/currency', 'canView'), masterController_1.getCurrencies);
router.post('/currencies', (0, auth_1.checkPermission)('/master/currency', 'canCreate'), masterController_1.createCurrency);
router.put('/currencies/:id', (0, auth_1.checkPermission)('/master/currency', 'canEdit'), masterController_1.updateCurrency);
router.delete('/currencies/:id', (0, auth_1.checkPermission)('/master/currency', 'canDelete'), masterController_1.deleteCurrency);
// Login Logs
router.get('/login-logs', (0, auth_1.checkPermission)('/master/login-logs', 'canView'), masterController_1.getLoginLogs);
// Website Dynamic Master Routes
// Category
router.get('/categories-master', (0, auth_1.checkPermission)('/master/category', 'canView'), masterController_1.getCategoryMaster);
router.post('/categories-master', (0, auth_1.checkPermission)('/master/category', 'canCreate'), masterController_1.createCategoryMaster);
router.put('/categories-master/:id', (0, auth_1.checkPermission)('/master/category', 'canEdit'), masterController_1.updateCategoryMaster);
router.delete('/categories-master/:id', (0, auth_1.checkPermission)('/master/category', 'canDelete'), masterController_1.deleteCategoryMaster);
// Product
router.get('/products-master', (0, auth_1.checkPermission)('/master/product', 'canView'), masterController_1.getProductMaster);
router.post('/products-master', (0, auth_1.checkPermission)('/master/product', 'canCreate'), masterController_1.createProductMaster);
router.put('/products-master/:id', (0, auth_1.checkPermission)('/master/product', 'canEdit'), masterController_1.updateProductMaster);
router.delete('/products-master/:id', (0, auth_1.checkPermission)('/master/product', 'canDelete'), masterController_1.deleteProductMaster);
// Testimonial
router.get('/testimonials-master', (0, auth_1.checkPermission)('/master/testimonial', 'canView'), masterController_1.getTestimonialMaster);
router.post('/testimonials-master', (0, auth_1.checkPermission)('/master/testimonial', 'canCreate'), masterController_1.createTestimonialMaster);
router.put('/testimonials-master/:id', (0, auth_1.checkPermission)('/master/testimonial', 'canEdit'), masterController_1.updateTestimonialMaster);
router.delete('/testimonials-master/:id', (0, auth_1.checkPermission)('/master/testimonial', 'canDelete'), masterController_1.deleteTestimonialMaster);
// FAQ
router.get('/faqs-master', (0, auth_1.checkPermission)('/master/faq', 'canView'), masterController_1.getFAQMaster);
router.post('/faqs-master', (0, auth_1.checkPermission)('/master/faq', 'canCreate'), masterController_1.createFAQMaster);
router.put('/faqs-master/:id', (0, auth_1.checkPermission)('/master/faq', 'canEdit'), masterController_1.updateFAQMaster);
router.delete('/faqs-master/:id', (0, auth_1.checkPermission)('/master/faq', 'canDelete'), masterController_1.deleteFAQMaster);
// Blog
router.get('/blogs-master', (0, auth_1.checkPermission)('/master/blog', 'canView'), masterController_1.getBlogMaster);
router.post('/blogs-master', (0, auth_1.checkPermission)('/master/blog', 'canCreate'), masterController_1.createBlogMaster);
router.put('/blogs-master/:id', (0, auth_1.checkPermission)('/master/blog', 'canEdit'), masterController_1.updateBlogMaster);
router.delete('/blogs-master/:id', (0, auth_1.checkPermission)('/master/blog', 'canDelete'), masterController_1.deleteBlogMaster);
// Inquiry (RFQs)
router.get('/inquiries-master', (0, auth_1.checkPermission)('/master/inquiry', 'canView'), masterController_1.getInquiryMaster);
router.delete('/inquiries-master/:id', (0, auth_1.checkPermission)('/master/inquiry', 'canDelete'), masterController_1.deleteInquiryMaster);
// Careers (the unlisted /career/ page)
router.get('/job-openings', (0, auth_1.checkPermission)('/admin/master/job-opening', 'canView'), careerController_1.getJobOpeningMaster);
router.post('/job-openings', (0, auth_1.checkPermission)('/admin/master/job-opening', 'canCreate'), careerController_1.createJobOpeningMaster);
router.put('/job-openings/:id', (0, auth_1.checkPermission)('/admin/master/job-opening', 'canEdit'), careerController_1.updateJobOpeningMaster);
router.delete('/job-openings/:id', (0, auth_1.checkPermission)('/admin/master/job-opening', 'canDelete'), careerController_1.deleteJobOpeningMaster);
router.get('/job-applications', (0, auth_1.checkPermission)('/admin/master/job-application', 'canView'), careerController_1.getJobApplicationMaster);
router.put('/job-applications/:id', (0, auth_1.checkPermission)('/admin/master/job-application', 'canEdit'), careerController_1.updateJobApplicationMaster);
router.delete('/job-applications/:id', (0, auth_1.checkPermission)('/admin/master/job-application', 'canDelete'), careerController_1.deleteJobApplicationMaster);
// Website Editor — live copy/images for every section of the public site
router.get('/site-sections', (0, auth_1.checkPermission)(WEBSITE_EDITOR_ROUTE, 'canView'), siteSectionController_1.getSiteSections);
router.put('/site-sections/:key', (0, auth_1.checkPermission)(WEBSITE_EDITOR_ROUTE, 'canEdit'), siteSectionController_1.saveSiteSection);
router.delete('/site-sections/:key', (0, auth_1.checkPermission)(WEBSITE_EDITOR_ROUTE, 'canDelete'), siteSectionController_1.resetSiteSection);
// 4. CMS Section
// Email Setup SMTP
router.get('/cms/email-setup', (0, auth_1.checkPermission)('/cms/email-setup', 'canView'), cmsController_1.getEmailSetup);
router.post('/cms/email-setup', (0, auth_1.checkPermission)('/cms/email-setup', 'canEdit'), cmsController_1.saveEmailSetup);
// Email For Event mappings
router.get('/cms/email-for', (0, auth_1.checkPermission)('/cms/email-for', 'canView'), cmsController_1.getEmailForList);
router.post('/cms/email-for', (0, auth_1.checkPermission)('/cms/email-for', 'canCreate'), cmsController_1.createEmailFor);
router.put('/cms/email-for/:id', (0, auth_1.checkPermission)('/cms/email-for', 'canEdit'), cmsController_1.updateEmailFor);
router.delete('/cms/email-for/:id', (0, auth_1.checkPermission)('/cms/email-for', 'canDelete'), cmsController_1.deleteEmailFor);
// Email Templates
router.get('/cms/email-templates', (0, auth_1.checkPermission)('/cms/email-template', 'canView'), cmsController_1.getEmailTemplates);
router.post('/cms/email-templates', (0, auth_1.checkPermission)('/cms/email-template', 'canCreate'), cmsController_1.createEmailTemplate);
router.put('/cms/email-templates/:id', (0, auth_1.checkPermission)('/cms/email-template', 'canEdit'), cmsController_1.updateEmailTemplate);
router.delete('/cms/email-templates/:id', (0, auth_1.checkPermission)('/cms/email-template', 'canDelete'), cmsController_1.deleteEmailTemplate);
router.post('/cms/test-send', (0, auth_1.checkPermission)('/cms/email-template', 'canEdit'), cmsController_1.testSendEmail);
exports.default = router;
