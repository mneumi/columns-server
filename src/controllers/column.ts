import { Context } from 'koa';
import { setResponseError, setResponseOk } from '../utils';
import { getManager, LessThan } from 'typeorm';
import * as qs from 'qs';

import { Column } from '../entity/column';
import { Post } from '../entity/post';

export default class ColumnController {
  public static async showColumnDetail(ctx: Context) {
    const columnRepository = getManager().getRepository(Column);

    const columnId = ctx.params.columnId;

    const column = await columnRepository.findOne({ columnId });

    if (column) {
      setResponseOk(ctx, 200, { column });
    } else {
      setResponseError(ctx, 404, '找不到专栏信息');
    }
  }

  public static async updateColumn(ctx: Context) {
    const columnId = ctx.params.columnId;

    if (columnId !== ctx.state.user.columnId) {
      setResponseError(ctx, 401, '无权限进行此操作');
      return;
    }

    const columnRepository = getManager().getRepository(Column);

    await columnRepository.update(
      { columnId },
      {
        picture: ctx.request.body.picture || '',
        title: ctx.request.body.title,
        desc: ctx.request.body.desc,
        updateAt: new Date().getTime() + '',
      }
    );

    const updatedColumn = await columnRepository.findOne({ columnId });

    if (updatedColumn) {
      setResponseOk(ctx, 200, { updatedColumn });
    } else {
      setResponseError(ctx, 404, '找不到专栏信息');
    }
  }

  public static async listColumns(ctx: Context) {
    const columnRepository = getManager().getRepository(Column);

    const { size = 3, page = 1 } = qs.parse(ctx.request.querystring);

    const whereCondition = { id: LessThan(11) };

    const total = await columnRepository.count({
      where: whereCondition,
    });

    const columns = await columnRepository.find({
      where: whereCondition,
      take: +size,
      skip: +size * (+page - 1),
    });

    const pagination = {
      page: +page,
      size: +size,
      total,
    };

    setResponseOk(ctx, 200, { list: columns, pagination });
  }

  public static async listPostsByColumnId(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const columnId = ctx.params.columnId;

    const { size = 3, page = 1 } = qs.parse(ctx.request.querystring);

    const total = await postRepository.count({
      where: {
        columnId,
      },
    });

    const posts = await postRepository.find({
      take: +size,
      skip: +size * (+page - 1),
      where: { columnId },
    });

    const pagination = {
      page: +page,
      size: +size,
      total,
    };

    setResponseOk(ctx, 200, { list: posts, pagination });
  }
}
