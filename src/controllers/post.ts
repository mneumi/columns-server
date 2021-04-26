import { Context } from 'koa';
import { setResponseError, setResponseOk } from '../utils';
import { getManager } from 'typeorm';
import * as qs from 'qs';

import { Post } from '../entity/post';
import { nanoid } from '../utils';
import { User } from '../entity/user';

export default class PostController {
  public static async createPost(ctx: Context) {
    const postRespository = getManager().getRepository(Post);

    const { content, picture = '', title, desc } = ctx.request.body;

    const currentTime = new Date().getTime() + '';
    const newPost = new Post();

    newPost.columnId = ctx.state.user.columnId;
    newPost.postId = nanoid();
    newPost.content = content;
    newPost.picture = picture;
    newPost.title = title;
    newPost.desc = desc;
    newPost.createAt = currentTime;
    newPost.updateAt = currentTime;

    await postRespository.save(newPost);

    setResponseOk(ctx, 200, newPost);
  }

  public static async showPostDetail(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const postId = ctx.params.postId;

    const post = await postRepository.findOne({ postId });

    const userRepository = getManager().getRepository(User);

    const user = await userRepository.findOne({ columnId: post?.columnId })

    if (post) {
      setResponseOk(ctx, 200, { post, user });
    } else {
      setResponseError(ctx, 404, '找不到文章信息');
    }
  }

  public static async updatePost(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const postId = ctx.params.postId;
    const columnId = ctx.state.user.columnId;

    const post = await postRepository.findOne({ postId, columnId });

    if (!post || post.postId !== postId) {
      setResponseError(ctx, 403, '无权进行此操作');
      return;
    }

    await postRepository.update(
      { postId },
      {
        title: ctx.request.body.title || post.title,
        content: ctx.request.body.content || post.content,
        picture: ctx.request.body.picture || post.picture,
        desc: ctx.request.body.desc || post.desc,
        updateAt: new Date().getTime() + '',
      }
    );

    const updatedPost = await postRepository.findOne({ postId });

    if (updatedPost) {
      setResponseOk(ctx, 200, { updatedPost });
    } else {
      setResponseError(ctx, 404, '找不到文章信息');
    }
  }

  public static async deletePost(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const postId = ctx.params.postId;
    const columnId = ctx.state.user.columnId;

    console.log(postId, columnId);

    const post = await postRepository.findOne({ postId, columnId });

    if (!post || post.postId !== postId) {
      setResponseError(ctx, 403, '无权进行此操作');
      return;
    }

    await postRepository.delete({ postId });

    setResponseOk(ctx, 204, {});
  }

  public static async listPosts(ctx: Context) {
    const postRepository = getManager().getRepository(Post);

    const { size = 5, page = 0 } = qs.parse(ctx.request.querystring);

    const total = await postRepository.count();

    const posts = await postRepository.find({
      take: +size,
      skip: +size * +page,
    });

    const pagination = {
      page: +page,
      size: +size,
      total,
    };

    setResponseOk(ctx, 200, { list: posts, pagination });
  }
}
