const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        console.log(socket.id);
        io.emit("receive-location", {id: socket.id, ...data})
    })
    socket.on("disconnect", () => {
        socket.emit('user-disconnected', socket.id)
    });
    socket.on("send-username", (data) => {
        socket.username = data
        io.emit("receive-username", {id: socket.id, username: data})
    })
});
app.get("/", (req, res) => {
    res.render("index");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})