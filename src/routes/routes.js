import cors from "cors";
import bodyParser from "body-parser";
/** APIS */
import upload from "./upload";

export default (app) => {
  const urlBodyParser = bodyParser.json();
  // Setting cors
  const corsOptions = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    // origin: process?.env?.WEBORIGIN,
    origin: "*",
    credentials: true,
  };

  upload({ app, parser: urlBodyParser, cors, corsOptions });
};
