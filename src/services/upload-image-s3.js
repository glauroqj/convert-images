import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

const s3 = new AWS.S3();

export default ({ image, format, name }) =>
  new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${name}.${format}`,
        Body: image,
        // ACL: ''
      };

      s3.upload(params, (err, data) => {
        if (err) {
          reject({
            message: "Something got wrong",
            error: err,
          });
          // throw new Error(err);
        }

        /** else */
        resolve({
          url: data?.key,
          format: format,
        });
      });
    } catch (e) {
      reject({
        message: "Something got wrong",
        error: e,
      });
      // throw new Error(e);
    }
  });
