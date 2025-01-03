import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// use alias
import 'module-alias/register';

import 'dotenv/config';

import { APP_ROUTES } from './routing';
import { blogsRoutes } from './routes/blogs-routes';
import { ErrorHandler } from './middlewares/ErrorHandler';
import { postsRoutes } from './routes/posts-routes';
import { testingRoute } from './routes/testingRoute';
import { usersRoutes } from './routes/users-routes';
import { authRoutes } from './routes/auth-routes';
import { commentsRoutes } from './routes/comments-routes';
import { devicesRoutes } from './routes/devices-routes';

export const app = express();

app.use(cors());
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());

app.use(APP_ROUTES.AUTH, authRoutes);
app.use(APP_ROUTES.BLOGS, blogsRoutes);
app.use(APP_ROUTES.POSTS, postsRoutes);
app.use(APP_ROUTES.COMMENTS, commentsRoutes);
app.use(APP_ROUTES.USERS, usersRoutes);
app.use(APP_ROUTES.DEVICES, devicesRoutes);
app.use(APP_ROUTES.TESTING, testingRoute);

app.use(ErrorHandler);
