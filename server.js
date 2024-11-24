import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from 'cors'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors())

const players = {}

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Add the new player with a default position
    players[socket.id] = { x: 100, y: 100 };

    // Emit the current players to the newly connected player
    socket.emit('currentPlayers', players);


    // Handle new player joining
    socket.on('newPlayer', (data) => {
        players[socket.id] = { x: data.x, y: data.y, id: socket.id };
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });

    // Handle player movement
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            socket.broadcast.emit("playerMove", { id: socket.id, x: data.x, y: data.y });
        }
        console.log(`Server received move:`, data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        delete players[socket.id];
        socket.broadcast.emit('playerDisconnect', socket.id);
    });
});
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})