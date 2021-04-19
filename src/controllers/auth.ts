import { Context } from 'koa';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

import { User } from '../entity/user';
import { Column } from "../entity/column"
import { JWT_SECRET } from '../constants';
import { setResponseError } from '../utils';
import { setResponseOk } from '../utils';
import { nanoid } from '../utils';

export default class AuthController {
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const user = await userRepository
      .createQueryBuilder()
      .where({ email: ctx.request.body.email })
      .addSelect('User.password')
      .getOne();

    if (!user) {
      setResponseError(ctx, 401, '用户名不存在');
    } else if (await argon2.verify(user.password, ctx.request.body.password)) {
      setResponseOk(ctx, 200, { token: jwt.sign({ id: user.id, userId: user.userId, columnId: user.columnId }, JWT_SECRET) });
    } else {
      setResponseError(ctx, 401, '用户名或密码错误');
    }
  }

  public static async register(ctx: Context) {
    const columnRespository = getManager().getRepository(Column);
    const userRepository = getManager().getRepository(User);

    const newColumnId = nanoid();

    const newColumn = new Column();
    newColumn.columnId = newColumnId;
    newColumn.desc = "还没有留下专栏简介哦";
    newColumn.picture = "";
    newColumn.title = "还没有设置专栏标题哦";

    await columnRespository.save(newColumn);

    const newUser = new User();
    newUser.nickname = ctx.request.body.nickname;
    newUser.email = ctx.request.body.email;
    newUser.password = await argon2.hash(ctx.request.body.password);
    newUser.userId = nanoid();
    newUser.desc = "还没有留下简介哦";
    newUser.avatar = "";
    newUser.columnId = newColumnId;
    
    try {
      const user = await userRepository.save(newUser);
      setResponseOk(ctx, 201, { user });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        setResponseError(ctx, 422, "注册失败，因为邮箱已被注册");
      } else {
        throw err;
      }
    }
  }
}
