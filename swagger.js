const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "crypto api generated",
    description: "Description",
  },
  host: "localhost:3001",
  schemes: ["https"],
};

const outputFile = "swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
