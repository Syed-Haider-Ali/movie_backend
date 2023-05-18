const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, 'please add a name field']
    },
    password:{
        type:String,
        required: [true, 'please add a hero field']
    }
},{
    timestamps: true
})


module.exports = mongoose.model('User',userSchema)