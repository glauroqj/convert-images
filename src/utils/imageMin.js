import imagemin from "imagemin";
import imageminWEBP from "imagemin-webp"; /** WEBP */

export default (file) =>
  new Promise((resolve, reject) => {
    imagemin
      .buffer(file, {
        destination: "./uploads/images",
        plugins: [imageminWEBP({ quality: 65 })],
      })
      .then((response) => {
        // upload file to S3
        console.log("< FILES > ", response);
        resolve(response);
      })
      .catch((error) => reject(error));
  });
