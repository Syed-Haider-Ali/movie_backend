const mongoose = require('mongoose')

const adminUserSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
     }
},{
    timestamps: true
})

// adminUserSchema.pre('save', async function(next){
//     if(this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 12)
//         this.cpassword = await bcrypt.hash(this.cpassword, 12)
//     }
//     next()
// })

module.exports = mongoose.model('AdminUser', adminUserSchema)