import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default ({ image, format, name }) =>
  new Promise((resolve) => {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${name}.${format}`,
        Body: image,
        // ACL: ''
      };

      s3.upload(params, (err, data) => {
        if (err) {
          throw new Error(err);
        }

        /** else */
        resolve({
          url: data?.key,
          format: format,
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  });
