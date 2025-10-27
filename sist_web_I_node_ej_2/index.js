console.log("Ejercicio 2: JSON  de películas");

// 1️⃣ Creamos el objeto con la información del cine
const cine = {
  peliculas: [
    {
      titulo: "Spider-Man: No Way Home",
      director: "Jon Watts",
      actores: ["Tom Holland", "Zendaya"],
      salas: {
        "17": ["17:00", "20:15"],
        "20": ["18:00", "21:15"]
      }    
    },
    {
      titulo: "The Matrix Resurrections",
      director: "Lana Wachowski",
      actores: ["Keanu Reeves", "Carrie-Anne Moss"],
      salas: {
        "5": ["19:15"],
        "22": ["22:30"]
      }
    }
  ]
};

// 2️⃣ Convertimos el objeto JS en texto JSON
const textoJSON = JSON.stringify(cine, null, 2);

// 3️⃣ Mostramos el JSON por consola
console.log(textoJSON);

// 4️⃣ Guardamos el JSON en un archivo
const fs = require("fs");

fs.writeFileSync("peliculas.json", textoJSON);
console.log("Archivo 'peliculas.json' creado correctamente.");
