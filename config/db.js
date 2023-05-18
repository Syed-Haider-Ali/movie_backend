const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb Connected`)
    }
    catch(error){
        console.log(`Mongodb Not Connected: ${error}`)
        process.exit(1)
    }
}

module.exports = connectDB