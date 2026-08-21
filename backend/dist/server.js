"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const seed_1 = require("./seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreeraj-admin';
// Ensure uploads directory exists
const uploadsPath = path_1.default.join(process.cwd(), 'public', 'uploads');
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath, { recursive: true });
}
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin)
            return callback(null, true);
        if (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.endsWith('.onrender.com') ||
            (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)) {
            return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Serve uploads statically
app.use('/uploads', express_1.default.static(uploadsPath));
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/public', publicRoutes_1.default);
app.use('/api/v1', apiRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
        data: null,
        meta: null
    });
});
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connect(MONGO_URI)
    .then(async () => {
    console.log('[Server] Connected to MongoDB database successfully.');
    await (0, seed_1.seedDatabase)();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Server] Express server is running on port ${PORT}`);
        console.log(`[Server] API Base path is /api/v1`);
    });
})
    .catch((err) => {
    console.error('[Server] Database connection failed:', err);
    process.exit(1);
});
