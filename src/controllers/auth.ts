import { Context } from 'koa';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

import { User } from '../entity/user';
import { Column } from '../entity/column';
import { JWT_SECRET } from '../constants';
import { setResponseError, setLimitError } from '../utils';
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
      setResponseOk(ctx, 200, {
        token: jwt.sign(
          { id: user.id, userId: user.userId, columnId: user.columnId },
          JWT_SECRET
        ),
      });
    } else {
      setResponseError(ctx, 401, '用户名或密码错误');
    }
  }

  public static async register(ctx: Context) {
    setLimitError(
      ctx,
      '温馨提示：为保证服务器数据安全，暂不提供注册服务，但提供了体验用的测试账号，请到登录页面进行体验，谢谢！'
    );

    return; // 阻断执行，为了保证服务器安全，暂不开放注册功能

    const columnRespository = getManager().getRepository(Column);
    const userRepository = getManager().getRepository(User);

    const currentTime = new Date().getTime() + '';

    const newColumnId = nanoid();

    const newColumn = new Column();
    newColumn.columnId = newColumnId;
    newColumn.desc = '还没有留下专栏简介哦';
    newColumn.picture =
      'https://columns-oss.oss-cn-shenzhen.aliyuncs.com/default-image.png';
    newColumn.title = '还没有设置专栏标题哦';
    newColumn.createAt = currentTime;
    newColumn.updateAt = currentTime;

    await columnRespository.save(newColumn);

    const newUser = new User();
    newUser.nickname = ctx.request.body.nickname;
    newUser.email = ctx.request.body.email;
    newUser.password = await argon2.hash(ctx.request.body.password);
    newUser.userId = nanoid();
    newUser.desc = '还没有留下简介哦';
    newUser.avatar =
      'https://columns-oss.oss-cn-shenzhen.aliyuncs.com/default-image.png';
    newUser.columnId = newColumnId;
    newUser.createAt = currentTime;
    newUser.updateAt = currentTime;

    try {
      const user = await userRepository.save(newUser);
      setResponseOk(ctx, 201, { user });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        setResponseError(ctx, 422, '注册失败，因为邮箱已被注册');
      } else {
        throw err;
      }
    }
  }
}
