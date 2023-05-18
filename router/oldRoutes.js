        // These are all useless now


        const videoFileMap={
            'cdn':'uploads/videos/Aaj rang hai..mp4',
            'cdn2':'uploads/videos/Bari Bari Imam Bari.mp4',
            'cdn3':'uploads/videos/Menu wal nai torr nibhawan da.mp4',
            'cdn4':'uploads/videos/sample.mp4',
        
        }

// getting all movies
app.get('/movies_api/action', asyncHandler (async (req,res)=>{
    const getMovies = await movieAction.find({},{video:0})
   
    res.status(200).json(getMovies)
})) 

// uploading movies
app.post('/movies_api/action',upload,async (req,res)=>{

    const name= req.body.name
    const hero = req.body.hero
    const heroine=req.body.heroine
    const year= req.body.year
    const thumbnail=req.files.thumbnail[0].path
    const video=req.files.video[0].path

    console.log('thumbnail path ',req.files.thumbnail[0].path)
    console.log('video path ',req.files.video[0].path)

    const ifExists = await movieAction.findOne({name:name})
    if(ifExists){
        res.status(400)
        throw new Error('Movie with this name already exists!')
    }

    const postMovie = await movieAction.create({
        name:name,
        hero:hero,
        heroine:heroine,
        year:year,
        thumbnail: thumbnail,
        video:video
    })
    if(!postMovie){
        res.status(400).json({error: 'movie cannot pe post'})
    }
    res.status(200).json(`${name} uploaded successfully`)
})

app.get('/movies_api/action/:title', asyncHandler(async(req,res)=>{
    const getMovie = await movieAction.find({name: req.params.title})
    if(!getMovie){
        return res.status(404).send('File not found')
    }
    res.status(200).json(getMovie)
}))


app.get('/movies_api/video/:name', asyncHandler (async(req,res)=>{
    const movie = await movieAction.find({name:req.params.name},{video:1}) 
    const video = movie[0]?.video
  
    const filePath = video
    if(!filePath){
        return res.status(404).send('File not found')
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
            'Content-Type': 'video/mp4'
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

app.get('/movies_api/action/videos', asyncHandler (async (req,res)=>{
    const getMovies = await movieAction.find({},{video:1, _id:0})
    const thumb = getMovies.map(t=>{
        return t?.video
    })

    res.status(200).json(thumb)
}))

app.post('/movies',upload,async (req,res)=>{

    const title= req.body.title
    const hero = req.body.hero
    const heroine=req.body.heroine
    const director = req.body.director
    const producer=req.body.producer
    const year= req.body.year
    const genre = req.body.genre
    const thumbnail=req.files.thumbnail[0].path
    const video=req.files.video[0].path

    console.log('thumbnail path ',req.files.thumbnail[0].path)
    console.log('video path ',req.files.video[0].path)

    const ifExists = await MovieModel.findOne({title:title})
    if(ifExists){
        res.status(400)
        throw new Error('Movie with this title already exists!')
    }

    const postMovie = await MovieModel.create({
        title,
        hero,
        heroine,
        director,
        producer,
        year,
        genre,
        thumbnail,
        video
    })
    if(!postMovie){
        res.status(400)
        throw new Error('movie cannot be post')
    }
    res.status(200).json(`${title} uploaded successfully`)
})

app.get('/movies',upload, async(req,res)=>{
    const getMovies = await MovieModel.find({},{video:0})
    if(!getMovies){
        res.status(400)
        throw new Error('no movie available')
    }
    res.status(200).json(getMovies)
})

app.get('/movies/:title', asyncHandler(async(req,res)=>{
    const getMovie = await MovieModel.find({title: req.params.title})
    if(!getMovie){
        return res.status(404).send('File not found')
    }
    res.status(200).json(getMovie)
}))

app.post('/movies_api/action',protectAdmin,upload,async (req,res)=>{
        // const {name,hero,heroine,year} = req.body
// const {nameFromToken,emailFromToken,phonefromToken} = await adminUser.findById(req.user)
// in adminauthMiddleware i am storing id (extracted from token) in req.user 

const name= req.body.name
const hero = req.body.hero
const heroine=req.body.heroine
const year= req.body.year
const thumbnail=req.files.thumbnail[0].path
const video=req.files.video[0].path

console.log('thumbnail path ',req.files.thumbnail[0].path)
console.log('video path ',req.files.video[0].path)

const ifExists = await movieAction.findOne({name:name})
if(ifExists){
    res.status(400)
    throw new Error('Movie with this name already exists!')
}

const postMovie = await movieAction.create({
    user: req.user.id,
    name:name,
    hero:hero,
    heroine:heroine,
    year:year,
    thumbnail: thumbnail,
    video:video
})
if(!postMovie){
    res.status(400).json({error: 'movie cannot pe post'})
}
res.status(200).json({name:postMovie.name , addedBy: req.user.name})
})

