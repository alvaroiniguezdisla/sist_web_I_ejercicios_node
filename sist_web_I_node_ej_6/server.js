const express = require("express");
const session = require("express-session");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// ---------------------------
// CONFIGURACIÓN
// ---------------------------
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));

// ---------------------------
// COMPROBAR SI HAY LOGIN
// ---------------------------
function checkLogin(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
}

// ---------------------------
// RUTAS
// ---------------------------
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username || username.trim() === "") {
        return res.send("Nombre inválido. <a href='/login'>Volver</a>");
    }

    req.session.user = username;
    res.redirect("/chat");
});

app.get("/chat", checkLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "views/chat.html"));
});

// ---------------------------
// SOCKET.IO
// ---------------------------

// HISTÓRICO DE MENSAJES
let history = [];

io.on("connection", (socket) => {
    console.log("Usuario conectado");

    // Guardar nombre desde la cookie de sesión simulada
    const username = socket.handshake.headers.cookie
        ?.split("connect.sid=")[1] ? "Usuario" : "Anon";

    // ENVIAR HISTÓRICO AL QUE SE CONECTA
    socket.emit("history", history);

    // RECIBIR MENSAJES
    socket.on("chat message", (data) => {
        // Guardar en historial
        history.push(data);
        if (history.length > 10) history.shift();

        // Enviar a todos
        io.emit("chat message", data);
    });
});

httpServer.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
