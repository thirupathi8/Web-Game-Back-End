import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from 'cors'
import playerRoute from "./routes/playerRoutes.js"
import PlayerInfo from "./models/playerInfo.js"
import mongoose from "mongoose"

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
})

app.use(cors())

app.use(express.json())

app.use("/player", playerRoute)

mongoose.connect("mongodb://localhost:27017/players")
const players = {}

io.on("connection", (socket) => {
    // console.log("A user connected", socket.id)
    socket.on("newPlayer", async (playerData) => {
        const playerInfo = await PlayerInfo.findOne({ playerId: playerData.playerId })

        if (playerInfo) {
            socket.emit("currentPlayers", {
                id: socket.id,
                x: playerInfo.x,
                y: playerInfo.y,
                email: playerData.email,
            })

            console.log("Current Player", playerInfo)
            io.emit("currentPlayers", players)
        } else {
            players[socket.id] = { ...playerData, x: 100, y: 100 }
            io.emit("currentPlayers", players)
        }
    })

    socket.on("move", async (playerData) => {
        // console.log("Movement received", playerData)
        if (players[socket.id]) {
            players[socket.id].x = playerData.x
            players[socket.id].y = playerData.y
            socket.broadcast.emit("playerMove", { id: socket.id, x: playerData.x, y: playerData.y })
            // console.log(`${socket.id} Movement sent x: ${playerData.x} y: ${playerData.y}`)
        }
    })

    socket.on("disconnect", async () => {
        // console.log("user disconnected")
        if (players[socket.id]) {
            const playerData = players[socket.id]
            await PlayerInfo.findOneAndUpdate(
                { playerId: playerData.playerId },
                { x: playerData.x, y: playerData.y }
            )

            socket.broadcast.emit("playerDisconnect", socket.id)
            // console.log("A player disconnected", socket.id)
            delete players[socket.id]
        }
    })
})
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})