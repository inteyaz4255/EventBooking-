const express = require("express")
const {protect} = require("../middleware/authMiddleware")
const router = express.Router()

//protected route
router.get("/profile",protect,(req,res)=>{
    res.status(200).json({
        message:"profile accessed successfully",
        user:req.user
    })
})

module.exports = router