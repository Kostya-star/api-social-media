import { AuthController } from './controllers/auth-controller';
import { BlogsController } from './controllers/blogs-controller';
import { CommentsController } from './controllers/comments-controller';
import { DevicesController } from './controllers/devices-controller';
import { PostsController } from './controllers/posts-controller';
import { TestingController } from './controllers/testing';
import { UsersController } from './controllers/users-controller';
import { BlogsRepositoryCommands } from './repositories/blogs/blogs-repository-commands';
import { CommentsRepositoryCommands } from './repositories/comments/comments-repository-commands';
import { LikesRepositoryCommands } from './repositories/likes/likes-repository-commands';
import { PostsRepositoryCommands } from './repositories/posts/posts-repository-commands';
import { SessionsRepositoryCommands } from './repositories/sessions/sessions-repository-commands';
import { UsersRepositoryCommands } from './repositories/users/users-repository-commands';
import { AuthService } from './services/auth-service';
import { BlogsService } from './services/blogs-service';
import { CommentsService } from './services/comments-service';
import { LikesService } from './services/likes-service';
import { MailService } from './services/mail-service';
import { PostsService } from './services/posts-service';
import { SessionsService } from './services/sessions-service';
import { UsersService } from './services/users-service';

const blogsRepositoryCommands = new BlogsRepositoryCommands();
const postsRepositoryCommands = new PostsRepositoryCommands();
const commentsRepositoryCommands = new CommentsRepositoryCommands();
const likesRepositoryCommands = new LikesRepositoryCommands();
const usersRepositoryCommands = new UsersRepositoryCommands();
const sessionsRepositoryCommands = new SessionsRepositoryCommands();

const blogsService = new BlogsService(blogsRepositoryCommands);
const postsService = new PostsService(postsRepositoryCommands, blogsRepositoryCommands);
const commentsService = new CommentsService(commentsRepositoryCommands, postsRepositoryCommands);
const likesService = new LikesService(likesRepositoryCommands, commentsRepositoryCommands);
const usersService = new UsersService(usersRepositoryCommands);
const sessionsService = new SessionsService(sessionsRepositoryCommands);
const mailService = new MailService();
const authService = new AuthService(usersRepositoryCommands, mailService, usersService, sessionsService, sessionsRepositoryCommands);

export const blogsController = new BlogsController(blogsService, postsService);
export const postsController = new PostsController(postsService, commentsService);
export const commentsController = new CommentsController(commentsService, likesService);
export const devicesController = new DevicesController(sessionsService);
export const usersController = new UsersController(usersService);
export const authController = new AuthController(authService);

// testing
export const testingController = new TestingController();
