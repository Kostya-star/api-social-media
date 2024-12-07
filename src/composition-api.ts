import { BlogsController } from './controllers/blogs-controller';
import { CommentsController } from './controllers/comments-controller';
import { PostsController } from './controllers/posts-controller';
import { BlogsRepositoryCommands } from './repositories/blogs/blogs-repository-commands';
import { CommentsRepositoryCommands } from './repositories/comments/comments-repository-commands';
import { PostsRepositoryCommands } from './repositories/posts/posts-repository-commands';
import { BlogsService } from './services/blogs-service';
import { CommentsService } from './services/comments-service';
import { PostsService } from './services/posts-service';

const blogsRepositoryCommands = new BlogsRepositoryCommands();
const postsRepositoryCommands = new PostsRepositoryCommands();
const commentsRepositoryCommands = new CommentsRepositoryCommands();

const blogsService = new BlogsService(blogsRepositoryCommands);
const postsService = new PostsService(postsRepositoryCommands, blogsRepositoryCommands);
const commentsService = new CommentsService(commentsRepositoryCommands, postsRepositoryCommands);

export const blogsController = new BlogsController(blogsService, postsService);
export const postsController = new PostsController(postsService);
export const commentsController = new CommentsController(commentsService);
