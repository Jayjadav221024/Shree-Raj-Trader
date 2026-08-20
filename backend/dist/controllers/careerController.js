"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobApplicationMaster = exports.updateJobApplicationMaster = exports.getJobApplicationMaster = exports.deleteJobOpeningMaster = exports.updateJobOpeningMaster = exports.createJobOpeningMaster = exports.getJobOpeningMaster = exports.createPublicJobApplication = exports.getPublicJobOpenings = void 0;
const zod_1 = require("zod");
const Career_1 = require("../models/Career");
const apiHelper_1 = require("../utils/apiHelper");
const jobOpeningSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    department: zod_1.z.string().optional().default(''),
    location: zod_1.z.string().optional().default(''),
    employmentType: zod_1.z.string().optional().default('Full-time'),
    experience: zod_1.z.string().optional().default(''),
    description: zod_1.z.string().optional().default(''),
    responsibilities: zod_1.z.array(zod_1.z.string()).optional().default([]),
    requirements: zod_1.z.array(zod_1.z.string()).optional().default([]),
    order: zod_1.z.number().optional().default(0),
    isActive: zod_1.z.boolean().optional().default(true)
});
const jobApplicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(5),
    position: zod_1.z.string().optional().default('General application'),
    experience: zod_1.z.string().optional().default(''),
    message: zod_1.z.string().optional().default(''),
    resumeUrl: zod_1.z.string().optional().default('')
});
// ---------------------------------------------------------------------------
// Public — used by the unlisted careers page
// ---------------------------------------------------------------------------
const getPublicJobOpenings = async (req, res, next) => {
    try {
        const items = await Career_1.JobOpening.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, message: 'Job openings retrieved', data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicJobOpenings = getPublicJobOpenings;
const createPublicJobApplication = async (req, res, next) => {
    try {
        const data = jobApplicationSchema.parse(req.body);
        const item = await Career_1.JobApplication.create(data);
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { id: item._id }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPublicJobApplication = createPublicJobApplication;
// ---------------------------------------------------------------------------
// Admin — Job Openings master
// ---------------------------------------------------------------------------
const getJobOpeningMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, Career_1.JobOpening, req.query, [
        'title',
        'department',
        'location',
        'employmentType',
        'experience'
    ]);
};
exports.getJobOpeningMaster = getJobOpeningMaster;
const createJobOpeningMaster = async (req, res, next) => {
    try {
        const data = jobOpeningSchema.parse(req.body);
        const item = await Career_1.JobOpening.create(data);
        res.status(201).json({ success: true, message: 'Job opening created successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.createJobOpeningMaster = createJobOpeningMaster;
const updateJobOpeningMaster = async (req, res, next) => {
    try {
        const data = jobOpeningSchema.partial().parse(req.body);
        const item = await Career_1.JobOpening.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Job opening updated successfully', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJobOpeningMaster = updateJobOpeningMaster;
const deleteJobOpeningMaster = async (req, res, next) => {
    try {
        await Career_1.JobOpening.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Job opening deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJobOpeningMaster = deleteJobOpeningMaster;
// ---------------------------------------------------------------------------
// Admin — Applications received
// ---------------------------------------------------------------------------
const getJobApplicationMaster = async (req, res, next) => {
    await (0, apiHelper_1.handlePagedRequest)(res, Career_1.JobApplication, req.query, [
        'name',
        'email',
        'phone',
        'position',
        'experience',
        'message',
        'status'
    ]);
};
exports.getJobApplicationMaster = getJobApplicationMaster;
/** Applications are read-only apart from the review status. */
const updateJobApplicationMaster = async (req, res, next) => {
    try {
        const data = zod_1.z.object({ status: zod_1.z.string().min(1) }).parse(req.body);
        const item = await Career_1.JobApplication.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json({ success: true, message: 'Application status updated', data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJobApplicationMaster = updateJobApplicationMaster;
const deleteJobApplicationMaster = async (req, res, next) => {
    try {
        await Career_1.JobApplication.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Application deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJobApplicationMaster = deleteJobApplicationMaster;
