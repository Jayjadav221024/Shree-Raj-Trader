import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';
import publicRoutes from './routes/publicRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { seedDatabase } from './seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreeraj-admin';

// Ensure uploads directory exists
const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploads statically
app.use('/uploads', express.static(uploadsPath));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1', apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    data: null,
    meta: null
  });
});

app.use(errorHandler);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('[Server] Connected to MongoDB database successfully.');
    
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`[Server] Express server is running on port ${PORT}`);
      console.log(`[Server] API Base path is http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.error('[Server] Database connection failed:', err);
    process.exit(1);
  });
