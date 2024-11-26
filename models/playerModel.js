import mongoose from "mongoose"

const playerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    }
})

const Player = mongoose.model("player", playerSchema)

export default Player