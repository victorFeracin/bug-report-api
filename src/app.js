const express = require("express");
const bugRoutes = require("./routes/bugRoutes");
const buildOpenApiSpec = require("./docs/openapi");
const renderSwaggerUiHtml = require("./docs/swaggerUi");

const app = express();

app.use(express.json());
app.use("/api", bugRoutes);

module.exports = app;
