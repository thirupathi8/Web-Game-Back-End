import Player from "../models/playerModel.js"
import PlayerInfo from "../models/playerInfo.js"
import jwt from "jsonwebtoken"

const handlePlayerSignup = async (req, res) => {
    try {
        const {email, password, x=100, y=100} = req.body

        const player = await Player.create({
            email,
            password
        })

        await PlayerInfo.create({
            playerId: player._id,
            x,
            y
        })

        res.status(201).json({message: "Player created successfully"})
    } catch (error) {
       console.error("Error during user creation") 
       res.status(500).json({message: "Error creating Player"})
    }
}

const handlePlayerLogin = async (req, res) => {
    try {
        const secretKey = "VerySecureKey"

        const {email, password} = req.body

        const player = await Player.findOne({email, password})

        if(!player){
            return res.status(401).json({message: "Invalid email or password"})
        }

        const token = jwt.sign({playerId: player._id}, secretKey, { expiresIn: '1h' })
        return res.status(200).json({message: "Login successful",token})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error logging in Player"})
    }
}

export {handlePlayerSignup, handlePlayerLogin}