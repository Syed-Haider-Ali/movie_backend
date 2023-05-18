const express = require('express') 
// const cookieParser = require('cookie-parser') 
const app = express()
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const {errorHandler} = require('./middlewares/errorMiddleware')
// const fs = require('fs')
// const asyncHandler = require('express-async-handler')
// const bcrypt = require('bcrypt')
// const jwt =require('jsonwebtoken')
        // models
const movieAction = require('./models/moviesModel')
// const adminUser = require('./models/AdminUser')
// const MovieModel = require('./models/MovieModel')
// const ExtraModel = require('./models/ExtraModel')

// const A = require('./models/AModel')
// const {protectAdmin} = require('./middlewares/AdminAuthMiddleware')
// const {upload,Aupload} = require('./middlewares/upload')
const cors = require('cors')
const crypto = require('crypto')
const { Error } = require('mongoose')

connectDB()   // mongo activated
const PORT = process.env.PORT || 5000
app.use(express.json({extended:false}))
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'))   // to use files publically
app.use(cors())

app.use(require('./router/auth'))
app.use(errorHandler)

        // these all routes shifted to router/auth.js
// app.post('/extra', upload, async(req,res)=>{
//     const title= req.body.title
//     const genres= req.body.genres
//     const thumbnail=req.files.thumbnail[0].path
//     const video=req.files.video[0].path

//     // const string = "Apple,Jucie,Mango";
//     const array = genres.split(" ");
//     // const tuna = array
//     // const a1=array[0]
//     // const a2=array[1]
//     // const a3=array[2]
//     // const a4=array[3]
//     // const luna = {a1 , a2 , a3 , a4}

//     console.log(genres)
//     const ifExists = await ExtraModel.findOne({title:title})
//     if(ifExists){
//         res.status(400)
//         throw new Error('Movie with this title already exists!')
//     }

//     const postMovie = await ExtraModel.create({
//          title:title, genres:array, thumbnail:thumbnail, video:video
//     })
//     if(!postMovie){
//         res.status(400)
//         throw new Error('movie cannot be post')
//     }
//     res.status(200).json(`${title} uploaded successfully`)
// })

// app.get('/extra/action', asyncHandler (async (req,res)=>{
//     const getMovies = await ExtraModel.find({ genres: 'crime' } )
    
//     res.status(200).json(getMovies)
// })) 


// app.get('/movies', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({},{video:0})
    
//     res.status(200).json(getMovies)
// })) 

// app.post('/movie',upload,async (req,res)=>{

//     const title= req.body.title
//     const language= req.body.language
//     const hero = req.body.hero
//     const heroine=req.body.heroine
//     const director=req.body.director
//     const producer=req.body.producer
//     const year= req.body.year
//     const genres= req.body.genres
//     const thumbnail=req.files.thumbnail[0].path
//     const video=req.files.video[0].path

//     console.log('thumbnail path ',req.files.thumbnail[0].path)
//     console.log('video path ',req.files.video[0].path)
//     const array = genres.split(" ")

//     const ifExists = await MovieModel.findOne({title:title})
//     if(ifExists){
//         res.status(400)
//         throw new Error('Movie with this title already exists!')
//     }

//     const postMovie = await MovieModel.create({
//         title, language, hero, heroine, director, producer, year, genres:array, thumbnail, video
//     })
//     if(!postMovie){
//         res.status(400)
//         throw new Error('movie cannot be post')
//     }
//     res.status(200).json(`${title} uploaded successfully`)
// })

// app.get('/movie/:title', asyncHandler(async(req,res)=>{
//     const getMovie = await MovieModel.find({title: req.params.title})
//     if(!getMovie){
//         return res.status(404).send('File not found')
//     }
//     res.status(200).json(getMovie)
// }))

//         // video streaming route
// app.get('/movie/video/:name', asyncHandler (async(req,res)=>{
//     const movie = await MovieModel.find({title:req.params.name},{video:1}) 
//     const video = movie[0]?.video
  
//     const filePath = video
//     if(!filePath){
//         return res.status(404).send('File not found')
//     }

//     const stat = fs.statSync(filePath);
//     const fileSize = stat.size;
//     const range = req.headers.range;

//     if(range){
//         const parts = range.replace(/bytes=/, '').split('-')
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//         const chunksize = end - start + 1;
//         const file = fs.createReadStream(filePath, {start, end});
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4'
//         };
//         res.writeHead(206, head);
//         file.pipe(res);
//     }
//     else{
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4'
//         };
//         res.writeHead(200, head);
//         fs.createReadStream(filePath).pipe(res)
//     }
// }))


// app.get('/movies/action', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Action"})
    
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/comedy', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Comedy"})
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/thriller', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Thriller"})
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/anime', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Anime"})
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/drama', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Drama"})
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/crime', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Crime"})
//     res.status(200).json(getMovies)
// }))

// app.get('/movies/horror', asyncHandler (async (req,res)=>{
//     const getMovies = await MovieModel.find({genres: "Horror"})
//     res.status(200).json(getMovies)
// }))


// app.post('/admin/login', asyncHandler(async(req,res)=>{
//     const {email, password} = req.body
//     if(!email || !password){
//         res.status(400)
//         throw new Error('Please fill all fields')
//     }
  
//     const user = await adminUser.findOne({email})
//     const hashedPassword = await bcrypt.compare(password, user.password)
   
//     if(user && hashedPassword){
//         res.json({
//             _id : user.id,
//             name: user.name,
//             email: user.email,
//             token: generateToken(user._id)
//         })
//     }
//     else{
//         res.status(400)
//         throw new Error('Invalid Credentials')
//     }
// }))

// //signup for admin
// app.post('/admin/register', asyncHandler(async(req,res)=>{
//     const {name, email, phone,  password} = req.body

//     if( !name || !email || !phone  || !password){
//         res.status(400)
//         throw new Error('please fill all fields')
//     }
//     const userExists = await adminUser.findOne({email: email})
    
//     if(userExists){
//         res.status(400)
//         throw new Error('Email already exists')
//     }
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const user = adminUser.create({
//         name: name,
//         email: email,
//         phone: phone,
//         password: hashedPassword,
        
//     })

//     if(user){
//         res.status(201).json({name,email,phone, token: generateToken(user._id)})
//     }else{
//         res.status(400)
//         throw new Error('invalid data')
//     }
// }))


// //updating movies
// app.put('/movie/:id', protectAdmin, asyncHandler(async(req,res)=>{
//     // const id = req.params.id
//     const getMovie = await movieAction.findById(req.params.id)

//     if(!getMovie){
//         res.status(400).json({error:'movie not found'})
//     }
//     const user = await adminUser.findById(req.user.id)
//     if(!user){
//         res.status(401).json({error:'user not found'})
//     }
//     // make sure the logged in user matches the movie user
//     if(getMovie.user.toString() !== user.id){
//         res.status(401).json({error: 'user not authorized'})
//     }

//     const updateMovie =  await MovieModel.findByIdAndUpdate(req.params.id, req.body, {new:true,})
//     res.status(200).json(updateMovie)
// })) // has some issues

// //deleting movies
// app.delete('/movie/:id', protectAdmin, asyncHandler(async(req,res)=>{
//     // const id = req.params.id
//     const getMovie = await MovieModel.findById(req.params.id)

//     if(!getMovie){
//         res.status(400).json({error:'movie not found'})
//     }
//     const user = await adminUser.findById(req.user.id)
//     if(!user){
//         res.status(401)
//         throw new Error('User not found')
//     }
//     // make sure the logged in user matches the movie user
//     if(getMovie.user.toString() !== user.id){
//         res.status(401)
//         throw new Error('User not authorized')
//     }
//     const movieRemoved = await getMovie.remove()
//     res.status(200).json({message: `${getMovie.name} successfully deleted -- ${movieRemoved}`})
// })) // completly working


// // app.get('/movies_api', async (req, res)=>{

// //     // const field = await movieAction.findOne({name: req.params.filename})
// //     const movie = await movieAction.find({ name: req.params.title });

// //     // const fileName = req.params.filename;
// //     const filePath = movie
// //     if(!filePath){
// //         return res.status(404).send('File not found')
// //     }

// //     const stat = fs.statSync(filePath);
// //     const fileSize = stat.size;
// //     const range = req.headers.range;

// //     if(range){
// //         const parts = range.replace(/bytes=/, '').split('-')
// //         const start = parseInt(parts[0], 10);
// //         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

// //         const chunksize = end - start + 1;
// //         const file = fs.createReadStream(filePath, {start, end});
// //         const head = {
// //             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
// //             'Accept-Ranges': 'bytes',
// //             'Content-Length': chunksize,
// //             'Content-Type': 'video/mp4'
// //         };
// //         res.writeHead(206, head);
// //         file.pipe(res);
// //     }
// //     else{
// //         const head = {
// //             'Content-Length': fileSize,
// //             'Content-Type': 'video/mp4'
// //         };
// //         res.status(200).json(movie);
// //         fs.createReadStream(filePath).pipe(res)
// //     }
// // })

// // video route
// // app.get('/videos/:filename', (req, res)=>{
// //     const fileName = req.params.filename;
// //     const filePath = videoFileMap[fileName]
// //     if(!filePath){
// //         return res.status(404).send('File not found')
// //     }

// //     const stat = fs.statSync(filePath);
// //     const fileSize = stat.size;
// //     const range = req.headers.range;

// //     if(range){
// //         const parts = range.replace(/bytes=/, '').split('-')
// //         const start = parseInt(parts[0], 10);
// //         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

// //         const chunksize = end - start + 1;
// //         const file = fs.createReadStream(filePath, {start, end});
// //         const head = {
// //             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
// //             'Accept-Ranges': 'bytes',
// //             'Content-Length': chunksize,
// //             'Content-Type': 'video/mp4'
// //         };
// //         res.writeHead(206, head);
// //         file.pipe(res);
// //     }
// //     else{
// //         const head = {
// //             'Content-Length': fileSize,
// //             'Content-Type': 'video/mp4'
// //         };
// //         res.writeHead(200, head);
// //         fs.createReadStream(filePath).pipe(res)
// //     }
// // })



// const generateToken = (id)=>{
//     return jwt.sign({id}, process.env.JWT_SECRET, {
//         expiresIn : '30d'
//     })
// }




module.exports = app.listen(PORT, console.log(`listening on Port: ${PORT}`))

// console.log(crypto.getCiphers())
// console.log(crypto.getHashes())


