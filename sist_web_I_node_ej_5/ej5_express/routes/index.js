var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {

  // Lista enviada desde el servidor
  const items = [
    'Tema 1: Introducción a Express',
    'Tema 2: Rutas y Middlewares',
    'Tema 3: Vistas con EJS',
    'Tema 4: Archivos estáticos',
    'Tema 5: Formularios (login)'
  ];

  // Renderiza la vista "index.ejs" con variables
  res.render('index', {
    title: 'Página inicial',
    items
  });
});

module.exports = router;
