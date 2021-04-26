import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import jwt from 'koa-jwt';
import 'reflect-metadata';

import { protectedRouter, unprotectedRouter } from './routes';
import { createConnection } from 'typeorm';
import { JWT_SECRET } from './constants';
import { setResponseError } from './utils';

createConnection()
  .then(() => {
    const app = new Koa();

    app.use(cors());
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          maxFieldsSize: 200 * 1024 * 1024,
        },
      })
    );

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        if (err.status && err.status === 401) {
          setResponseError(ctx, 401, '无权限操作');
        } else {
          ctx.status = err.status || 500;
          ctx.body = { message: err.message };
        }
      }
    });

    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    app.listen(3000);
  })
  .catch((err: string) => {
    console.log('TypeORM connection error:', err);
  });
