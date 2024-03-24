const { Router } = require("express");
const { getHello } = require("./app.service");

const getHelloRoute = Router();

getHelloRoute.get("/", (req, res) => {
  res.send(getHello());
});

module.exports = {
  getHelloRoute,
};
