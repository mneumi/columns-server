import { Context } from 'koa';
import { nanoid, setResponseError, setResponseOk } from '../utils';
import OSSClient from '../oss';
import fs from 'fs';

export default class UploadController {
  public static async upload(ctx: Context) {
    try {
      for (const fileName in ctx.request.files) {
        const ext = (fileName.split('.').pop() as string).toLocaleLowerCase();
        const name = `${new Date().getTime()}-${nanoid()}.${ext}`;

        const fileObj = ctx.request.files[fileName];

        const reader = fs.createReadStream((fileObj as any).path);

        const result = await OSSClient.put(name, reader);
        reader.close();

        setResponseOk(ctx, 200, {
          url: result.url,
        });

        return;
      }
    } catch (err) {
      setResponseError(ctx, 500, '服务器错误，上传文件失败');
    }
  }
}
