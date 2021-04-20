import OSS from 'ali-oss';
import { accessKeyId, accessKeySecret } from './secret';

const OSSClient = new OSS({
  region: 'oss-cn-shenzhen',
  bucket: 'columns-oss',
  accessKeyId,
  accessKeySecret,
});

export default OSSClient;
