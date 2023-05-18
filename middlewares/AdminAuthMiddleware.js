const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/AdminUser')


const protectAdmin = asyncHandler( async(req,res,next)=>{
    let token

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            //Get token from the header
            token = req.headers.authorization.split(' ')[1]
            // means token is comming like - Bearer tokens2238292389
            //so split will make an array and i want to have 1st index - token

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password')
            // except password extract every field of user (document)

            next()

        }catch(error){
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, not token at all')
    }
})


module.exports = {protectAdmin}