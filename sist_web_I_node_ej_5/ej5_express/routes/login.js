var express = require('express');
var router = express.Router();

/* GET /login -> muestra formulario */
router.get('/', function(req, res) {
  res.render('login', { title: 'Login', message: null });
});

/* POST /login -> procesa formulario */
router.post('/', function(req, res) {
  const { username, password } = req.body;

  if (username && password) {
    return res.render('login', {
      title: 'Login',
      message: `Bienvenido, ${username}! (demo)`
    });
  }

  res.render('login', { title: 'Login', message: 'Introduce usuario y contraseña' });
});

module.exports = router;
