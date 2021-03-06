import { Context } from 'koa';
import { customAlphabet } from 'nanoid';
import { createContext } from 'node:vm';

export const setResponseOk = (
  ctx: Context,
  code: number,
  data: { [key: string]: any }
): void => {
  ctx.status = code;
  ctx.body = {
    error: 0,
    data,
  };
};

export const setResponseError = (
  ctx: Context,
  code: number,
  message: string
): void => {
  ctx.status = code;
  ctx.body = {
    error: 1,
    data: {
      message,
    },
  };
};

export const setLimitError = (ctx: Context, message: string) => {
  ctx.status = 403;
  ctx.body = {
    error: 2,
    data: { message },
  };
};

export const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);