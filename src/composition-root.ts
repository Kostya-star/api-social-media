import { AuthController } from './controllers/auth-controller';
import { BlogsController } from './controllers/blogs-controller';
import { CommentsController } from './controllers/comments-controller';
import { DevicesController } from './controllers/devices-controller';
import { PostsController } from './controllers/posts-controller';
import { TestingController } from './controllers/testing';
import { UsersController } from './controllers/users-controller';
import { ReqRateLimiter } from './middlewares/requests-rate-limiter';
import { BlogsRepositoryQuery } from './repositories/blogs/blogs-repository-query';
import { container } from './inversify.config';
import { TYPES } from './composition-root-types';

// resolve dependencies from the container
// Query repositories
export const blogsRepositoryQuery = container.get<BlogsRepositoryQuery>(TYPES.blogsRepositoryQuery);

// Controllers
export const blogsController = container.get<BlogsController>(TYPES.blogsController);
export const postsController = container.get<PostsController>(TYPES.postsController);
export const commentsController = container.get<CommentsController>(TYPES.commentsController);
export const devicesController = container.get<DevicesController>(TYPES.devicesController);
export const usersController = container.get<UsersController>(TYPES.usersController);
export const authController = container.get<AuthController>(TYPES.authController);

// Middleware
export const reqRateLimiter = container.get<ReqRateLimiter>(TYPES.reqRateLimiter);

// Testing
export const testingController = container.get<TestingController>(TYPES.testingController);
