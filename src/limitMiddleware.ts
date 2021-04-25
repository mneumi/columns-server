import { Context } from 'koa';

export const limitMiddleware = async (ctx: Context, next: any) => {
  await next();
}