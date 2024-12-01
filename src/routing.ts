interface IAPP_ROUTES {
  AUTH: string;
  BLOGS: string;
  POSTS: string;
  USERS: string;
  COMMENTS: string;
  DEVICES: string;
  TESTING: string;
}

export const APP_ROUTES: IAPP_ROUTES = {
  AUTH: '/auth',
  BLOGS: '/blogs',
  POSTS: '/posts',
  USERS: '/users',
  COMMENTS: '/comments',
  DEVICES: '/security/devices',
  TESTING: '/testing/all-data',
};
