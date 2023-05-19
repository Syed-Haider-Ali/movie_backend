const express = require('express') 
// const cookieParser = require('cookie-parser') 
const app = express()
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const {errorHandler} = require('./middlewares/errorMiddleware')
// const asyncHandler = require('express-async-handler')
// const bcrypt = require('bcrypt')
// const jwt =require('jsonwebtoken')
        // models


// const {protectAdmin} = require('./middlewares/AdminAuthMiddleware')
// const {upload,Aupload} = require('./middlewares/upload')
const cors = require('cors')
const { Error } = require('mongoose')

connectDB()   // mongo activated
const PORT = process.env.PORT || 5000
app.use(express.json({extended:false}))
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'))   // to use files publically
app.use(cors())

app.use(require('./router/auth'))
app.use(errorHandler)



module.exports = app.listen(PORT, console.log(`listening on Port: ${PORT}`))

// console.log(crypto.getCiphers())
// console.log(crypto.getHashes())


