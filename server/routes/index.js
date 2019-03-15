const express = require('express');
const app = express();

//requerimos y usamos routes/usuario
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;