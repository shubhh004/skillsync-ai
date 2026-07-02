import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/index.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.use(errorHandler);

export default app;
