const express = require("express");
const axios = require("axios");

const { serviceMap } = require("./serviceMap");

const app = express();
const PORT = 8181;

// Middleware to forward requests
app.use((req, res) => {
  const { alias } = req.params;
  const serviceUrl = serviceMap[alias];

  if (!serviceUrl) {
    return res.status(404).send("Service not found");
  }

  // Forward the request to the service
  axios({
    method: req.method,
    url: `${serviceUrl}${req.url}`,
    data: req.body,
    headers: req.headers,
  })
    .then((response) => {
      res.status(response.status).send(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
});

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
