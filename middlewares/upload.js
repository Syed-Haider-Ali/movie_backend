const path   = require('path')
const multer = require('multer') // used to manage disk storage

const Astorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/A/')
    },
    filename: function(req,file,cb){
        // const ext = path.extname(file.originalname)
        cb(null, file.originalname)
    }  
})

const Aupload = multer({
    storage:Astorage,
    fileFilter: function(req,file,cb){
        if(file.mimetype == 'image/png' ||
           file.mimetype == 'image/jpg' ||
           file.mimetype == 'image/jpeg'){
            cb(null, true)
           }
           else{
            console.log('jpg/jpeg/png supported')
            cb(null, false)
           }
    },
    limits:{
        fileSize: 1024 * 1024 * 1024* 1
    }
}).single('image')


const storage = multer.diskStorage({
        destination: function(req,file,cb){
            if (file.fieldname == "thumbnail") {
                cb(null, './uploads/thumbnails')
            }
            else if (file.fieldname == "video") {
                cb(null, './uploads/videos');
            }
        },
        filename: function(req,file,cb){
            // const ext = path.extname(file.originalname)
            if(file.fieldname == 'thumbnail'){
                cb(null, file.originalname)
            }
            else if(file.fieldname == 'video'){
                cb(null, file.originalname )
            }
        }  
    })

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).fields([
    {
        name:'thumbnail',
        maxCount:1
    },
    {
        name: 'video', 
        maxCount:1
    }
])

const checkFileType = (file, cb) => {
    if (file.fieldname === "thumbnail") {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'||
            fiel.mimetype==='image/gif'
          ) { // check file type to be png, jpeg, or jpg
            cb(null, true);
          } else {
            cb(null, false); // else fails
          }
        }
    else  if (file.fieldname === "video") {
        if (
            file.mimetype === 'video/mp4'){ // check file type to be pdf, doc, or docx
              cb(null, true);
          } else {
              cb(null, false); // else fails
          }
    }
    }

// single.array('avatar[]')   -- to upload multiple files 

module.exports = {upload, Aupload }

