const http = require('http');
const fs = require('fs');

const port = 3000;

const server = http.createServer((req, res) => {
  // Establecemos cabecera
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  // Leemos el diccionario (asíncrono para no bloquear)
  fs.readFile('words.txt', 'utf8', (err, data) => {
    if (err) {
      res.end('Error al leer el diccionario');
      return;
    }

    // Convertimos el texto a un array de palabras
    const words = data.trim().split('\n');

    // Obtenemos el número de palabras (X) de la URL
    // Ejemplo: http://localhost:3000/?x=3
    const url = new URL(req.url, `http://${req.headers.host}`);
    const x = parseInt(url.searchParams.get('x')) || 3; // por defecto 3 palabras

    // Seleccionamos X palabras aleatorias
    const randomWords = [];
    for (let i = 0; i < x; i++) {
      const index = Math.floor(Math.random() * words.length);
      randomWords.push(words[index]);
    }

    // Generamos la contraseña uniendo las palabras
    const password = randomWords.join('-');

    res.end(`<h1>Contraseña generada:</h1><p>${password}</p>`);
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
