export const TYPES = {
  // query repos
  blogsRepositoryQuery: Symbol.for('BlogsRepositoryQuery'),
  postsRepositoryQuery: Symbol.for('PostsRepositoryQuery'),
  commentsRepositoryQuery: Symbol.for('CommentsRepositoryQuery'),
  sessionsRepositoryQuery: Symbol.for('SessionsRepositoryQuery'),
  usersRepositoryQuery: Symbol.for('UsersRepositoryQuery'),

  // commands repos
  blogsRepositoryCommands: Symbol.for('BlogsRepositoryCommands'),
  postsRepositoryCommands: Symbol.for('PostsRepositoryCommands'),
  commentsRepositoryCommands: Symbol.for('CommentsRepositoryCommands'),
  likesRepositoryCommands: Symbol.for('LikesRepositoryCommands'),
  usersRepositoryCommands: Symbol.for('UsersRepositoryCommands'),
  sessionsRepositoryCommands: Symbol.for('SessionsRepositoryCommands'),
  requestsRateRepositoryCommands: Symbol.for('RequestsRateRepositoryCommands'),

  // services
  blogsService: Symbol.for('BlogsService'),
  postsService: Symbol.for('PostsService'),
  commentsService: Symbol.for('CommentsService'),
  likesService: Symbol.for('LikesService'),
  usersService: Symbol.for('UsersService'),
  sessionsService: Symbol.for('SessionsService'),
  mailService: Symbol.for('MailService'),
  authService: Symbol.for('AuthService'),

  // controllers
  blogsController: Symbol.for('BlogsController'),
  postsController: Symbol.for('PostsController'),
  commentsController: Symbol.for('CommentsController'),
  devicesController: Symbol.for('DevicesController'),
  usersController: Symbol.for('UsersController'),
  authController: Symbol.for('AuthController'),

  // middlewares
  reqRateLimiter: Symbol.for('ReqRateLimiter'),

  // testing
  testingController: Symbol.for('TestingController'),
};
