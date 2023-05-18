const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AdminUser'
    },
    name:{
        type:String,
        required: true
    },
    hero:{
        type:String,
        required: true
    },
    heroine:{
        type:String,
        required: true
    },
    year:{
        type:String,
        required: true
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



module.exports = mongoose.model('Action',movieSchema)