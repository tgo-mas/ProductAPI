require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

// Configuração do App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("uploads"));

// Configuração do Banco de Dados
mongoose.connect(process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true });

const produtoApi = require("./routes/produtos");
app.use(produtoApi);

// Escuta de eventos
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});