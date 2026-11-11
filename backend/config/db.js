const mongoose = require("mongoose")
require("dotenv").config()
const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongodb is connected successfully")
    }catch(error){
        console.log("MongoDB connection failed:",error.message)
        process.exit(1)
    }
}

module.exports = connectDb;