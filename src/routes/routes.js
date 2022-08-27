import cors from "cors";
import bodyParser from "body-parser";
/** APIS */
import convert from "./convert";
// import posts from './posts'
// import gets from './gets'

export default (app) => {
  const urlBodyParser = bodyParser.json();
  // Setting cors
  const corsOptions = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    origin: process?.env?.WEBORIGIN,
    credentials: true,
  };

  convert({ app, parser: urlBodyParser, cors, corsOptions });
  // posts({app, parser: urlBodyParser, cors, corsOptions})
  // gets({app, parser: urlBodyParser, cors, corsOptions})
};
