import multer from "multer";
import fs from "fs";
import AWS from "aws-sdk";

import { convertImage, bufferToStream } from "../utils/convertImage";
import imageminHelper from "../utils/imageMin";

const upload = multer({ storage: multer.memoryStorage() });

/** aws configs */
import { aws_access, aws_params } from "../../aws-config";

export default ({ app, parser, cors, corsOptions }) => {
  app.get("/health-check", parser, cors(corsOptions), (req, res) => {
    console.log("< HEALTH CHECK - OK >");
    res.json({ status: "Server is running!" });
  });

  app.post(
    "/upload-file",
    parser,
    cors(corsOptions),
    upload.single("image"),
    async (req, res) => {
      if (!req.file) {
        res.status(500).send({
          message: "something got wrong!",
        });
      }

      const stream = bufferToStream(req?.file?.buffer);
      // console.log("< IMAGE URL > ", stream);
      const output = await convertImage(stream, "webp");

      console.log("< OUTPUT > ", output);
      // output.pipe(process.stdout);
      // output.pipe(fs.createWriteStream("./image.webp"));

      res.status(200);
    }
  );

  app.post(
    "/upload-file-imagemin",
    parser,
    cors(corsOptions),
    upload.single("image"),
    async (req, res) => {
      if (!req.file) {
        res.status(500).send({
          message: "something got wrong!",
        });
      }

      console.log("< FILE > ", req?.file);

      const image = await imageminHelper(req?.file?.buffer);

      fs.writeFile("./uploads/test.webp", image, "binary", (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File created successfully!");
        }
      });

      const s3 = new AWS.S3({
        ...aws_access,
      });

      const params = {
        ...aws_params,
        Key: "imagem-maneira.webp",
        Body: image,
      };

      try {
        s3.upload(params, (err, data) => {
          console.log("< AWS S3 UPLOAD >", err, data);
          res.status(200).send({
            message: "Sended!",
          });
        });
      } catch (e) {
        res.status(500).send({
          message: "something got wrong!",
        });
      }
    }
  );
};

/**
 * DOC: https://xetera.dev/converting-webp/
 */
