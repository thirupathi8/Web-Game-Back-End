import express from "express"
import { handlePlayerLogin, handlePlayerSignup } from "../controllers/playerLogin.js"
import validateToken from "../controllers/playerAuth.js"

const router = express.Router()

router.post("/signup", handlePlayerSignup)

router.post("/login", handlePlayerLogin)

router.post("/validate-token", validateToken)

export default router