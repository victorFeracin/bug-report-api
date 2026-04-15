const express = require("express");
const bugRoutes = require("./routes/bugRoutes");
const buildOpenApiSpec = require("./docs/openapi");
const renderSwaggerUiHtml = require("./docs/swaggerUi");

const app = express();

app.use(express.json());

app.get("/docs/openapi.json", (req, res) => {
  return res.json(buildOpenApiSpec(req));
});

app.get("/docs", (req, res) => {
  res.type("html");
  return res.send(renderSwaggerUiHtml());
});

app.use(bugRoutes);

module.exports = app;
