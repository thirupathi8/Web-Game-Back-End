import jwt from "jsonwebtoken"

const validateToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }
    
    try {
        const decoded = jwt.verify(token, "VerySecureKey")
        return res.status(200).json({ message: "Token is valid", decoded })
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Invalid Token" })
    }
}

export default validateToken