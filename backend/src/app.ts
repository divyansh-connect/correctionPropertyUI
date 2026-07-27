import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middlewares/requestId.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// --- Core Hardening & Request Middlewares ---
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // Do not block request entirely if checking in REST clients
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestIdMiddleware);
app.use(globalRateLimiter);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- API Router Mount ---
app.use(env.API_PREFIX, routes);

// --- Global Error Handling Middleware ---
app.use(errorHandler);

export default app;
