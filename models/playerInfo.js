import mongoose from "mongoose"

const playerInfoSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true
    },

    x: {
        type: Number,
        default: 100
    },

    y: {
        type: Number,
        default: 100
    }
})

const PlayerInfo = mongoose.model("PlayerInfo", playerInfoSchema)

export default PlayerInfo