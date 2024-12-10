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
import { TYPES } from './composition-root-types';

import { Container } from 'inversify';

// Create the IoC container
export const container = new Container();

// Bind query repositories
container.bind<BlogsRepositoryQuery>(TYPES.blogsRepositoryQuery).to(BlogsRepositoryQuery);
container.bind<PostsRepositoryQuery>(TYPES.postsRepositoryQuery).to(PostsRepositoryQuery);
container.bind<CommentsRepositoryQuery>(TYPES.commentsRepositoryQuery).to(CommentsRepositoryQuery);
container.bind<SessionsRepositoryQuery>(TYPES.sessionsRepositoryQuery).to(SessionsRepositoryQuery);
container.bind<UsersRepositoryQuery>(TYPES.usersRepositoryQuery).to(UsersRepositoryQuery);

// Bind command repositories
container.bind<BlogsRepositoryCommands>(TYPES.blogsRepositoryCommands).to(BlogsRepositoryCommands);
container.bind<PostsRepositoryCommands>(TYPES.postsRepositoryCommands).to(PostsRepositoryCommands);
container.bind<CommentsRepositoryCommands>(TYPES.commentsRepositoryCommands).to(CommentsRepositoryCommands);
container.bind<LikesRepositoryCommands>(TYPES.likesRepositoryCommands).to(LikesRepositoryCommands);
container.bind<UsersRepositoryCommands>(TYPES.usersRepositoryCommands).to(UsersRepositoryCommands);
container.bind<SessionsRepositoryCommands>(TYPES.sessionsRepositoryCommands).to(SessionsRepositoryCommands);
container.bind<RequestsRateRepositoryCommands>(TYPES.requestsRateRepositoryCommands).to(RequestsRateRepositoryCommands);

// Bind services
container.bind<BlogsService>(TYPES.blogsService).to(BlogsService);
container.bind<PostsService>(TYPES.postsService).to(PostsService);
container.bind<CommentsService>(TYPES.commentsService).to(CommentsService);
container.bind<LikesService>(TYPES.likesService).to(LikesService);
container.bind<UsersService>(TYPES.usersService).to(UsersService);
container.bind<SessionsService>(TYPES.sessionsService).to(SessionsService);
container.bind<MailService>(TYPES.mailService).to(MailService);
container.bind<AuthService>(TYPES.authService).to(AuthService);

// Bind controllers
container.bind<BlogsController>(TYPES.blogsController).to(BlogsController);
container.bind<PostsController>(TYPES.postsController).to(PostsController);
container.bind<CommentsController>(TYPES.commentsController).to(CommentsController);
container.bind<DevicesController>(TYPES.devicesController).to(DevicesController);
container.bind<UsersController>(TYPES.usersController).to(UsersController);
container.bind<AuthController>(TYPES.authController).to(AuthController);

// Bind middleware
container.bind<ReqRateLimiter>(TYPES.reqRateLimiter).to(ReqRateLimiter);

// Bind testing controller
container.bind<TestingController>(TYPES.testingController).to(TestingController);
