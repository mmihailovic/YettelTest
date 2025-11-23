const express = require('express')
const routes = require('./routes')
const errorHandler = require('./middlewares/error.middleware')
const { swaggerUi, swaggerUiSetup } = require("./swagger");

const app = express()
app.use(express.json());
app.use('/api', routes)
app.use(errorHandler)
app.use("/api-docs", swaggerUi.serve, swaggerUiSetup);

module.exports = app
