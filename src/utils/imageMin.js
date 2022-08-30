import imagemin from "imagemin";
import imageminWEBP from "imagemin-webp"; /** WEBP */
import imageminPngquant from "imagemin-pngquant"; /** PNG */

const uniqueID = (type) => {
  const start = Date.now().toString(36);
  const tail = Math.random().toString(36).substring(2);

  return `image-${type || ""}-${start + tail}`;
};

const imageminHandler = (buffer, pluginsParam) =>
  imagemin.buffer(buffer, {
    plugins: [pluginsParam],
  });

const generateWEBP = (buffer) =>
  new Promise(async (resolve) => {
    try {
      const webp = await imageminHandler(buffer, imageminWEBP({ quality: 65 }));

      resolve(webp);
    } catch (e) {
      resolve(false);
    }
  });

const generatePNG = (buffer) =>
  new Promise(async (resolve) => {
    try {
      const png = await imageminHandler(
        buffer,
        imageminPngquant({ quality: [0.4, 0.6] })
      );

      resolve(png);
    } catch (e) {
      resolve(false);
    }
  });

export default (buffer) =>
  new Promise((resolve, reject) => {
    Promise.all([generateWEBP(buffer), generatePNG(buffer)])
      .then((values) => {
        const [WEBP, PNG] = values;
        resolve([
          {
            image: WEBP,
            format: "webp",
            name: uniqueID("webp"),
          },
          {
            image: PNG,
            format: "png",
            name: uniqueID("png"),
          },
        ]);
      })
      .catch((e) => {
        reject(e);
      });
  });
