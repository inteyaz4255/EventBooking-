const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db")
const authRoutes = require("./routes/authRoutes.js")
const userRoutes = require("./routes/userRoutes")
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes.js");
require("dotenv").config()

const app = express()

//midllerware
app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/bookings", bookingRoutes);

//test route
app.get("/",(req,res)=>{
    res.send("Event booking APi is running")
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDb()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()