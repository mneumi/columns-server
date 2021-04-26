import { Context } from 'koa';
import { setResponseError, setResponseOk } from '../utils';
import { getManager } from 'typeorm';

import { User } from '../entity/user';

export default class UserController {
  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const userId = ctx.params.userId;

    const user = await userRepository.findOne({ userId });

    if (user) {
      setResponseOk(ctx, 200, { user });
    } else {
      setResponseError(ctx, 404, '找不到用户');
    }
  }

  public static async getUserInfoByToken(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const userId = ctx?.state?.user?.userId;

    if (!userId) {
      setResponseError(ctx, 404, '未找到token，请先登录');
      return;
    }

    const user = await userRepository.findOne({ userId });

    if (user) {
      setResponseOk(ctx, 200, { user });
    } else {
      setResponseError(ctx, 404, '找不到用户');
    }
  }

  public static async updateUser(ctx: Context) {
    const userId = ctx.params.userId;

    if (userId !== ctx.state.user.userId) {
      setResponseError(ctx, 401, '无权限进行此操作');
      return;
    }

    const userRepository = getManager().getRepository(User);

    await userRepository.update(
      { userId },
      {
        nickname: ctx.request.body.nickname,
        desc: ctx.request.body.desc,
        avatar: ctx.request.body.avatar || '',
      }
    );

    const updatedUser = await userRepository.findOne({ userId });

    if (updatedUser) {
      setResponseOk(ctx, 200, { updatedUser });
    } else {
      setResponseError(ctx, 404, '找不到用户');
    }
  }

  public static async listUsers(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const users = await userRepository.find();

    setResponseOk(ctx, 200, { users });
  }

  public static async deleteUser(ctx: Context) {
    const userId = +ctx.params.id;

    if (userId !== +ctx.state.user.id) {
      setResponseError(ctx, 401, '无权限进行此操作');
      return;
    }

    const userRepository = getManager().getRepository(User);

    await userRepository.delete(userId);

    setResponseOk(ctx, 204, {});
  }
}
