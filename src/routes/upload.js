import multer from "multer";

import imageminHelper from "../utils/imageMin";

import uploadImageS3 from "../services/upload-image-s3";

const upload = multer({ storage: multer.memoryStorage() });

export default ({ app, parser, cors, corsOptions }) => {
  app.get(
    "/health-check",
    /*parser, cors(corsOptions),*/ (req, res) => {
      console.log("< HEALTH CHECK - OK >");
      res.json({ status: "Server is running!" });
    }
  );

  app.post(
    "/upload-file",
    parser,
    cors(corsOptions),
    upload.single("image"),
    async (req, res) => {
      if (!req.file) {
        res.status(500).send({
          message: "something got wrong! Send a body with image atribute",
        });
      }

      // console.log("< FILE > ", req?.file);

      try {
        const arrayImages = await imageminHelper(req?.file?.buffer);

        if (arrayImages?.length > 0) {
          const buildPromise = arrayImages.map((item) => uploadImageS3(item));

          Promise.all(buildPromise)
            .then((values) => {
              console.log("< UPLOAD S3 - RESPONSE > ", values);

              const newReponsePayload = values.reduce((acc, cur) => {
                /* check format */
                let oldPayload = {
                  image: "",
                };
                if (cur.format === "webp") {
                  oldPayload.image = cur?.url;
                  acc = {
                    ...acc,
                    ...oldPayload,
                  };
                }

                acc = {
                  ...acc,
                  [`image_${cur?.format}`]: cur?.url,
                };

                return acc;
              }, {});

              res.status(200).send({
                ...newReponsePayload,
              });
            })
            .catch((e) => {
              console.warn(e);
              res.status(500).send({
                message: "something got wrong!",
              });
            });
        } else {
          res.status(400).send({
            message: "something got wrong in imageminHelper",
          });
        }
      } catch (e) {
        console.warn(e);
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
