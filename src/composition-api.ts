import { BlogsController } from './controllers/blogs-controller';
import { CommentsController } from './controllers/comments-controller';
import { DevicesController } from './controllers/devices-controller';
import { PostsController } from './controllers/posts-controller';
import { BlogsRepositoryCommands } from './repositories/blogs/blogs-repository-commands';
import { CommentsRepositoryCommands } from './repositories/comments/comments-repository-commands';
import { LikesRepositoryCommands } from './repositories/likes/likes-repository-commands';
import { PostsRepositoryCommands } from './repositories/posts/posts-repository-commands';
import { SessionsRepositoryCommands } from './repositories/sessions/sessions-repository-commands';
import { BlogsService } from './services/blogs-service';
import { CommentsService } from './services/comments-service';
import { LikesService } from './services/likes-service';
import { PostsService } from './services/posts-service';
import { SessionsService } from './services/sessions-service';

const blogsRepositoryCommands = new BlogsRepositoryCommands();
const postsRepositoryCommands = new PostsRepositoryCommands();
const commentsRepositoryCommands = new CommentsRepositoryCommands();
const likesRepositoryCommands = new LikesRepositoryCommands();
const sessionsRepositoryCommands = new SessionsRepositoryCommands();

const blogsService = new BlogsService(blogsRepositoryCommands);
const postsService = new PostsService(postsRepositoryCommands, blogsRepositoryCommands);
const commentsService = new CommentsService(commentsRepositoryCommands, postsRepositoryCommands);
const likesService = new LikesService(likesRepositoryCommands, commentsRepositoryCommands);
const sessionsService = new SessionsService(sessionsRepositoryCommands);

export const blogsController = new BlogsController(blogsService, postsService);
export const postsController = new PostsController(postsService, commentsService);
export const commentsController = new CommentsController(commentsService, likesService);
export const devicesController = new DevicesController(sessionsService);
