require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

const swaggerDoc = require("./swagger.json");

// Configuração do App
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Configuração do Banco de Dados
mongoose.connect(process.env.MONGODB_URL);

const produtoApi = require("./routes/produtos");
app.use(produtoApi);


// Escuta de eventos
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});