import { Context } from 'koa';
import { setResponseError, setResponseOk } from '../utils';
import { getManager } from 'typeorm';
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
      setResponseError(ctx, 403, '无权进行此操作');
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

    const { size = 5, page = 0 } = qs.parse(ctx.request.querystring);

    const columns = await columnRepository.find({
      take: +size,
      skip: +size * +page,
    });

    setResponseOk(ctx, 200, { columns });
  }

  public static async listPostsByColumnId(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const columnId = ctx.params.columnId;
    const { size = 5, page = 0 } = qs.parse(ctx.request.querystring);

    const posts = await postRepository.find({
      take: +size,
      skip: +size * +page,
      where: { columnId },
    });

    setResponseOk(ctx, 200, { posts });
  }
}
