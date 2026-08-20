"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageUpload = exports.handleDocumentUpload = exports.uploadDocument = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists
const uploadDir = path_1.default.join(process.cwd(), 'public', 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${uniqueSuffix}-${sanitizedName}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg|gif|avif/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files (jpeg, jpg, png, webp, svg, gif, avif) are allowed!'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter
});
/**
 * CV uploads from the careers page. Kept separate from `upload` because that one
 * only accepts images — widening it would let a document be submitted anywhere
 * the admin panel expects a picture.
 */
const documentFilter = (req, file, cb) => {
    const allowedExtensions = /pdf|doc|docx|rtf|odt/;
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/rtf',
        'application/vnd.oasis.opendocument.text'
    ];
    const hasExtension = allowedExtensions.test(path_1.default.extname(file.originalname).toLowerCase());
    const hasMimeType = allowedMimeTypes.includes(file.mimetype);
    if (hasExtension && hasMimeType) {
        cb(null, true);
        return;
    }
    cb(new Error('Only PDF or Word documents are accepted.'));
};
exports.uploadDocument = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB is plenty for a CV
    fileFilter: documentFilter
});
const handleDocumentUpload = (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded', data: null });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Document uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/${req.file.filename}`
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.handleDocumentUpload = handleDocumentUpload;
const handleImageUpload = (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded',
                data: null
            });
            return;
        }
        // Construct accessible public URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: fileUrl,
                key: fileUrl // allow using direct url as key
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.handleImageUpload = handleImageUpload;
