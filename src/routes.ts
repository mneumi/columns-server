import Router from '@koa/router';

import AuthController from './controllers/auth';
import ColumnController from './controllers/column';
import PostController from './controllers/post';
import UploadController from './controllers/upload';
import UserController from './controllers/user';
import { limitMiddleware } from './limitMiddleware';

const unprotectedRouter = new Router();

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);

const protectedRouter = new Router();

// users 相关的路由
// protectedRouter.get('/users', UserController.listUsers);
// protectedRouter.delete('/users/:userId', UserController.deleteUser);
protectedRouter.get('/users/:userId', UserController.showUserDetail);
protectedRouter.post('/users', UserController.getUserInfoByToken);
protectedRouter.put(
  '/users/:userId',
  limitMiddleware,
  UserController.updateUser
);

// column 相关的路由
protectedRouter.get('/columns', ColumnController.listColumns);
protectedRouter.get('/columns/:columnId', ColumnController.showColumnDetail);
protectedRouter.get(
  '/columns/:columnId/posts',
  ColumnController.listPostsByColumnId
);
protectedRouter.put(
  '/columns/:columnId',
  limitMiddleware,
  ColumnController.updateColumn
);

// post 相关的路由
// protectedRouter.get('/posts', PostController.listPosts);
protectedRouter.get('/posts/:postId', PostController.showPostDetail);
protectedRouter.post('/posts', limitMiddleware, PostController.createPost);
protectedRouter.patch(
  '/posts/:postId',
  limitMiddleware,
  PostController.updatePost
);
protectedRouter.delete(
  '/posts/:postId',
  limitMiddleware,
  PostController.deletePost
);

// file 相关的路由
protectedRouter.post('/upload', limitMiddleware, UploadController.upload);

export { protectedRouter, unprotectedRouter };
