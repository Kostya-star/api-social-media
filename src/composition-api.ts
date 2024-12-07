import { AuthController } from './controllers/auth-controller';
import { BlogsController } from './controllers/blogs-controller';
import { CommentsController } from './controllers/comments-controller';
import { DevicesController } from './controllers/devices-controller';
import { PostsController } from './controllers/posts-controller';
import { TestingController } from './controllers/testing';
import { UsersController } from './controllers/users-controller';
import { ReqRateLimiter } from './middlewares/requests-rate-limiter';
import { BlogsRepositoryCommands } from './repositories/blogs/blogs-repository-commands';
import { BlogsRepositoryQuery } from './repositories/blogs/blogs-repository-query';
import { CommentsRepositoryCommands } from './repositories/comments/comments-repository-commands';
import { CommentsRepositoryQuery } from './repositories/comments/comments-repository-query';
import { LikesRepositoryCommands } from './repositories/likes-repository-commands';
import { PostsRepositoryCommands } from './repositories/posts/posts-repository-commands';
import { PostsRepositoryQuery } from './repositories/posts/posts-repository-query';
import { RequestsRateRepositoryCommands } from './repositories/requests-rate-repository';
import { SessionsRepositoryCommands } from './repositories/sessions/sessions-repository-commands';
import { SessionsRepositoryQuery } from './repositories/sessions/sessions-repository-query';
import { UsersRepositoryCommands } from './repositories/users/users-repository-commands';
import { UsersRepositoryQuery } from './repositories/users/users-repository-query';
import { AuthService } from './services/auth-service';
import { BlogsService } from './services/blogs-service';
import { CommentsService } from './services/comments-service';
import { LikesService } from './services/likes-service';
import { MailService } from './services/mail-service';
import { PostsService } from './services/posts-service';
import { SessionsService } from './services/sessions-service';
import { UsersService } from './services/users-service';

// query repos
export const blogsRepositoryQuery = new BlogsRepositoryQuery();
const postsRepositoryQuery = new PostsRepositoryQuery();
const commentsRepositoryQuery = new CommentsRepositoryQuery();
const sessionsRepositoryQuery = new SessionsRepositoryQuery();
const usersRepositoryQuery = new UsersRepositoryQuery();

// commands repos
const blogsRepositoryCommands = new BlogsRepositoryCommands();
const postsRepositoryCommands = new PostsRepositoryCommands();
const commentsRepositoryCommands = new CommentsRepositoryCommands();
const likesRepositoryCommands = new LikesRepositoryCommands();
const usersRepositoryCommands = new UsersRepositoryCommands();
const sessionsRepositoryCommands = new SessionsRepositoryCommands();
const requestsRateRepositoryCommands = new RequestsRateRepositoryCommands();

// services
const blogsService = new BlogsService(blogsRepositoryCommands);
const postsService = new PostsService(postsRepositoryCommands, blogsRepositoryCommands);
const commentsService = new CommentsService(commentsRepositoryCommands, postsRepositoryCommands, usersRepositoryCommands);
const likesService = new LikesService(likesRepositoryCommands, commentsRepositoryCommands);
const usersService = new UsersService(usersRepositoryCommands);
const sessionsService = new SessionsService(sessionsRepositoryCommands);
const mailService = new MailService();
const authService = new AuthService(usersRepositoryCommands, mailService, usersService, sessionsService, sessionsRepositoryCommands);

// controllers
export const blogsController = new BlogsController(blogsService, postsService, blogsRepositoryQuery, postsRepositoryQuery);
export const postsController = new PostsController(postsService, commentsService, postsRepositoryQuery, commentsRepositoryQuery);
export const commentsController = new CommentsController(commentsService, likesService, commentsRepositoryQuery);
export const devicesController = new DevicesController(sessionsService, sessionsRepositoryQuery);
export const usersController = new UsersController(usersService, usersRepositoryQuery);
export const authController = new AuthController(authService, usersRepositoryQuery);

// middlewares
export const reqRateLimiter = new ReqRateLimiter(requestsRateRepositoryCommands);

// testing
export const testingController = new TestingController();
