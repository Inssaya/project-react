import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import routes from './routes/index.js';

const app = express();

// Global middlewares
// Enable CORS for all origins in development
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

// API routes
app.use('/api', routes);

import path from 'path';

// Serve a minimal static frontend for testing at /app
// The frontend is located in the workspace `frontend/public` folder
app.use('/app', express.static(path.join(process.cwd(), '..', 'frontend', 'public')));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'MySchools API running ✅' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
