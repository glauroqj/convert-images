import express from "express";
/** routes */
import routes from "./routes/routes";

const port = process.env.PORT || 5000;
const app = express();

/** app routes */
routes(app);

app.listen(port, () => {
  console.log(`
    CHECKING ENV VARS - 
    AC-KEY: ${process.env.AWS_ACCESS_KEY_ID}
    SC-KEY: ${process.env.AWS_SECRET_ACCESS_KEY}
    REGION: ${process.env.AWS_REGION}
    BUCKET: ${process.env.S3_BUCKET_NAME}
  `);

  console.log(`Server is running at localhost:${port}`);
});
