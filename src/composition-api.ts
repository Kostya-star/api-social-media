import { BlogsController } from './controllers/blogs-controller';
import { BlogsRepositoryCommands } from './repositories/blogs/blogs-repository-commands';
import { BlogsService } from './services/blogs-service';

const blogsRepositoryCommands = new BlogsRepositoryCommands();
const blogsService = new BlogsService(blogsRepositoryCommands);
export const blogsController = new BlogsController(blogsService);
