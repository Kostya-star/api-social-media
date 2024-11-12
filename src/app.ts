import express from 'express';

// use alias
import 'module-alias/register';

import 'dotenv/config';

import { APP_ROUTES } from './settings/routing';
import { blogsRoutes } from './routes/blogs';
import { ErrorHandler } from './middlewares/ErrorHandler';
// import { postsRoutes } from './routes/posts';
import { testingRoute } from './routes/testingRoute';

export const app = express();

app.use(express.json());

app.use(APP_ROUTES.BLOGS, blogsRoutes);
// app.use(APP_ROUTES.POSTS, postsRoutes);
app.use(APP_ROUTES.TESTING, testingRoute);

app.use(ErrorHandler);
