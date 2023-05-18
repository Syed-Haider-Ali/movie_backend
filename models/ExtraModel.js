const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'AdminUser'
    // },
    title:{
        type:String,
        required: true
    },
    genres:[{
        type:String,
        required: true
    }],
    thumbnail:{
        type:String,
     },
    video:{
        type:String
    }
},{
    timestamps: true
})



module.exports = mongoose.model('Extra',movieSchema)