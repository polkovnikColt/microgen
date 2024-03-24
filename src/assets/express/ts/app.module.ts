import express, { Application } from "express";
import { getHelloRoute } from "./app.controller";

export function createApp(): Application {
  const app = express();

  app.use(getHelloRoute);

  return app;
}

const app = createApp();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
