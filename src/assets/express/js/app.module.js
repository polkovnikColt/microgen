const express = require("express");
const { getHelloRoute } = require("./app.controller");

function createApp() {
  const app = express();

  app.use(getHelloRoute);

  return app;
}

const app = createApp();
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
