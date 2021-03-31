const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './app/views'); // a rota é a partir de onde está sendo dado o include

app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({ extended: true })); // por ser um moddleware precisa ficar antes dos includes de módulos da aplicação
app.use(expressValidator());

// inclui as rotas identificadas à aplicação
consign()
    .include('app/routes')
    .then('config/dbConnection.js')
    .then('app/models')
    .then('app/controllers')
    .into(app);

module.exports = app;