const mongoose = require('mongoose')
const videoSchema = mongoose.Schema({
    title:{
        type:String
    },
    thumbnail:{
        type:String,
        required: true
     },
    video:{
        type:String
    }
},{
    timestamps: true
})



module.exports = mongoose.model('Video',videoSchema)