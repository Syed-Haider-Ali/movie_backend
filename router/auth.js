const express = require('express')
const router = express.Router()
const fs = require('fs')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const crypto = require('crypto');
const rangeParser = require('range-parser');
const path = require('path')

const adminUser = require('../models/AdminUser')
const MovieModel = require('../models/MovieModel')
const VideoModel = require('../models/videoModel')

const {protectAdmin} = require('../middlewares/AdminAuthMiddleware')
const {upload,Aupload} = require('../middlewares/upload')
const ExtraModel = require('../models/ExtraModel')


const algorithm = 'aes-256-ctr'
let key = 'MySecretKey'
key= crypto.createHash('sha256').update(String(key)).digest('base64').substring(0,32)


// router.post('/video',upload,async (req,res)=>{

//     const title = req.body.title
//     const thumbnail=req.files.thumbnail[0].path
//     const video=req.files.video[0].path

//     const encrypt = async (videoName)=>{
        
//         const readStream = fs.createReadStream(videoName)
//         const writeStream = fs.createWriteStream();

//         const iv = '1234567887654321'
//         const cipher = crypto.createCipheriv(algorithm, key, iv)

//     // const encryptedVideo = Buffer.concat([iv, cipher.update(video), cipher.final()])
//         return 

//     }

//     // const writeStream = fs.createWriteStream()
//     console.log('video path ',req.files.video[0].path)

//     const ifExists = await VideoModel.findOne({title:title})
//     if(ifExists){
//         res.status(400)
//         throw new Error('Movie with this title already exists!')
//     }

//     const postMovie = await VideoModel.create({
//        title,  thumbnail, video
//     })
//     if(!postMovie){
//         res.status(400)
//         throw new Error('movie cannot be post')
//     }
//     res.status(201).json(`${title} uploaded successfully`)
// })





router.post('/movie',protectAdmin,upload,async (req,res)=>{

    const title= req.body.title
    const language= req.body.language
    const hero = req.body.hero
    const heroine=req.body.heroine
    const director=req.body.director
    const producer=req.body.producer
    const year= req.body.year
    const genres= req.body.genres
    const thumbnail=req.files.thumbnail[0].path
    const video=req.files.video[0].path

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encryptedVideo = Buffer.concat([iv, cipher.update(video), cipher.final()])
    
    console.log('thumbnail path ',req.files.thumbnail[0].path)
    console.log('video path ',req.files.video[0].path)

    const array = genres.split(" ")

    const ifExists = await MovieModel.findOne({title:title})
    if(ifExists){
        res.status(400)
        throw new Error('Movie with this title already exists!')
    }

    const postMovie = await MovieModel.create({
       user:req.user.id, title, language, hero, heroine, director, producer, year, genres:array, thumbnail, video:encryptedVideo
    })
    if(!postMovie){
        res.status(400)
        throw new Error('movie cannot be post')
    }
    res.status(201).json(`${title} uploaded successfully`)
})

// original POst movie route



        // video streaming route

router.get('/movie/video/:title', asyncHandler (async(req,res)=>{
    const movie = await MovieModel.find({title:req.params.title},{video:1}) 
    const video = movie[0]?.video
    
  
    const filePath = video
    if(!filePath){
        return res.status(404).send('Movie with this name is not available')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4', 
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Content-Disposition': 'inline'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res)
    }
}))



        // Encrypted Video Route
router.get('/movie/encvideo/:name', asyncHandler (async(req,res)=>{
    const movie = await MovieModel.find({title:req.params.name},{video:1}) 
    const video = movie[0]?.video

    const iv = video.slice(0,16)

    //Get the rest
    video = video.slice(16)

    // Create Decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    // Decrypt file 
    const result = Buffer.concat([decipher.update(video), decipher.final()])
    console.log('decrypted video route')
    console.log(result)
  
    const filePath = result
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const rangeRequest = rangeParser(fileSize, req.headers.range, { combine: true });
    if (rangeRequest)
    {
        const start = rangeRequest[0].start;
        const end = rangeRequest[0].end;
        const chunkSize = (end - start) + 1;
    
        // const iv = crypto.randomBytes(16);
        // const key = crypto.createHash('sha256').update(filePath).digest();
        // const key= '1234567887654321'
        // const iv = '1234567887654321'
    
        // const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        // const readStream = fs.createReadStream(filePath, { start, end });
        //     const head = {
        //         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        //         'Accept-Ranges': 'bytes',
        //         'Content-Length': chunksize,
        //         'Content-Type': 'video/mp4'
        //     };
        const head = {
            'Content-Type': 'video/mp4',
            'Content-Length': chunkSize,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Content-Disposition': 'inline'
        }
  
        res.writeHead(206, head);
        readStream.pipe(res);
}
else{
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res)
}

}))



        // Get all movies
router.get('/movies', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({},{video:0})

    if(!getMovies){
        return res.status(404).json('Unable to fetch movies')
    }
    
    res.status(200).json(getMovies)
})) 


        // Get movie by title
router.get('/movie/:title', asyncHandler(async(req,res)=>{
    const getMovie = await MovieModel.findOne({title: req.params.title})
    if(getMovie){
        return res.status(200).json(getMovie)
    }
    else{
        return res.status(404).json('Movie with this name not found')
    }
}))


        // Movies by Category

router.get('/movies/action', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Action"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    
    res.status(200).json(getMovies)
}))

router.get('/movies/comedy', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Comedy"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))

router.get('/movies/thriller', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Thriller"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))

router.get('/movies/anime', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Anime"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))

router.get('/movies/drama', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Drama"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))

router.get('/movies/crime', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Crime"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))

router.get('/movies/horror', asyncHandler (async (req,res)=>{
    const getMovies = await MovieModel.find({genres: "Horror"})
    if(!getMovies){
        return res.status(404).json('Movies not available')
    }
    res.status(200).json(getMovies)
}))


router.post('/admin/login', asyncHandler(async(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error('Please fill all fields')
    }
  
    const user = await adminUser.findOne({email})
    const hashedPassword = await bcrypt.compare(password, user.password)
   
    if(user && hashedPassword){
        res.json({
            _id : user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
}))

//signup for admin
router.post('/admin/register', asyncHandler(async(req,res)=>{
    const {name, email,  password} = req.body

    if( !name || !email  || !password){
        res.status(400)
        throw new Error('please fill all fields')
    }
    const userExists = await adminUser.findOne({email: email})
    
    if(userExists){
        res.status(400)
        throw new Error('Email already exists')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = adminUser.create({
        name: name,
        email: email,
        password: hashedPassword,
        
    })

    if(user){
        res.status(201).json({name,email,phone, token: generateToken(user._id)})
    }else{
        res.status(400)
        throw new Error('invalid data')
    }
}))


//updating movies
router.put('/movie/:id', protectAdmin, asyncHandler(async(req,res)=>{
    // const id = req.params.id
    const getMovie = await movieAction.findById(req.params.id)

    if(!getMovie){
        res.status(400).json({error:'movie not found'})
    }
    const user = await adminUser.findById(req.user.id)
    if(!user){
        res.status(401).json({error:'user not found'})
    }
    // make sure the logged in user matches the movie user
    if(getMovie.user.toString() !== user.id){
        res.status(401).json({error: 'user not authorized'})
    }

    const updateMovie =  await MovieModel.findByIdAndUpdate(req.params.id, req.body, {new:true,})
    res.status(200).json(updateMovie)
})) // has some issues

//deleting movies
router.delete('/movie/:id', protectAdmin, asyncHandler(async(req,res)=>{
    // const id = req.params.id
    const getMovie = await MovieModel.findById(req.params.id)

    if(!getMovie){
        res.status(400).json({error:'movie not found'})
    }
    const user = await adminUser.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // make sure the logged in user matches the movie user
    // if(getMovie.user.toString() !== user.id){
    //     res.status(401)
    //     throw new Error('User not authorized')
    // }
    const movieRemoved = await getMovie.remove()
    res.status(200).json({message: `${getMovie.name} successfully deleted -- ${movieRemoved}`})
})) // completly working


        // some testing routes
router.post('/extra', upload, async(req,res)=>{
    const title= req.body.title
    const genres= req.body.genres
    const thumbnail=req.files.thumbnail[0].path
    const video=req.files.video[0].path

    // const string = "Apple,Jucie,Mango";
    const array = genres.split(" ");
    // const tuna = array
    // const a1=array[0]
    // const a2=array[1]
    // const a3=array[2]
    // const a4=array[3]
    // const luna = {a1 , a2 , a3 , a4}

    console.log(genres)
    const ifExists = await ExtraModel.findOne({title:title})
    if(ifExists){
        res.status(400)
        throw new Error('Movie with this title already exists!')
    }

    const postMovie = await ExtraModel.create({
         title:title, genres:array, thumbnail:thumbnail, video:video
    })
    if(!postMovie){
        res.status(400)
        throw new Error('movie cannot be post')
    }
    res.status(200).json(`${title} uploaded successfully`)
})

router.get('/extra/action', asyncHandler (async (req,res)=>{
    const getMovies = await ExtraModel.find({ genres: 'crime' } )
    
    res.status(200).json(getMovies)
})) 
        // ended testing routes


const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : '30d'
    })
}


module.exports = router