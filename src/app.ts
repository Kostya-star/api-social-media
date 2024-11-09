// use alias
import 'module-alias/register';
import 'dotenv/config'

import express from 'express';
import { APP_ROUTES } from './settings/routing';
import { blogsRoutes } from './routes/blogs';
import { ErrorHandler } from './middlewares/ErrorHandler';

export const app = express();

app.use(express.json());

app.use(APP_ROUTES.BLOGS, blogsRoutes);

app.use(ErrorHandler);
