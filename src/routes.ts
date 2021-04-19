import Router from '@koa/router';

import AuthController from "./controllers/auth";
import ColumnController from './controllers/column';
import PostController from './controllers/post';
import UserController from './controllers/user';

const unprotectedRouter = new Router();

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);

const protectedRouter = new Router();

// users 相关的路由
// protectedRouter.get('/users', UserController.listUsers);
protectedRouter.post('/users', UserController.getUserInfoByToken);
protectedRouter.get('/users/:userId', UserController.showUserDetail);
protectedRouter.put('/users/:userId', UserController.updateUser);
// protectedRouter.delete('/users/:userId', UserController.deleteUser);

// column 相关的路由
protectedRouter.get('/columns/:columnId', ColumnController.showColumnDetail);
protectedRouter.put('/columns/:columnId', ColumnController.updateColumn);
protectedRouter.get('/columns', ColumnController.listPosts);

// post 相关的路由
protectedRouter.get('/posts/:postId', PostController.showPostDetail);
protectedRouter.post('/posts', PostController.createPost);
protectedRouter.patch('/posts/:postId', PostController.updatePost);
protectedRouter.delete('/posts/:postId', PostController.deletePost);
protectedRouter.get('/posts', PostController.listPosts);

export { protectedRouter, unprotectedRouter };