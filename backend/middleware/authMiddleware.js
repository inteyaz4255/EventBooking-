const jwt = require("jsonwebtoken")

const protect = (req,res,next)=>{
    try{
        //Get authorization header
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Not authorized,token missing"
            })
        }
        //Extract token
        const token = authHeader.split(" ")[1]

        //verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        //Store user information in request
        req.user = decoded

        //continue to next middleware or route

        next()
    }catch(error){
        return res.status(401).json({
            message:"not authorized invalid or expired token "
        })
    }
}

module.exports = {protect}