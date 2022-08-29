import { Readable, PassThrough } from "stream";

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath.path);

const convertImage = (image, outputFormat) => {
  if (!image || !outputFormat)
    throw new Error("some parameters are missing! ", image, outputFormat);

  return new Promise((resolve, reject) => {
    const chunks = [];
    const passthrough = new PassThrough();
    ffmpeg()
      .input(image)
      .outputFormat(outputFormat)
      .on("error", reject)
      .stream(passthrough, { end: true });
    passthrough.on("data", (data) => chunks.push(data));
    passthrough.on("error", reject);
    passthrough.on("end", () => {
      const originalImage = Buffer.concat(chunks);
      const editedImage = originalImage
        // copy everything after the last 4 bytes into the 4th position
        .copyWithin(4, -4)
        // trim off the extra last 4 bytes ffmpeg added
        .slice(0, -4);
      console.log("< end >");
      return resolve(editedImage);
    });
  });
};

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export { convertImage, bufferToStream };

// convertImage("./image.png", "./image.webp");
