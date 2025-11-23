const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yettel Test",
      version: "1.0.0",
      description: "API documentation for my solution",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUiSetup = swaggerUi.setup(swaggerSpec);

module.exports = { swaggerSpec, swaggerUi, swaggerUiSetup };