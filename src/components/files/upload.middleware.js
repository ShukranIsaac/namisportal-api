const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fileService = require('./service');
const categoriesService = require('../categories/service')


const MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638',
    pdf: '25504446'
}


const destinationDirectory = 'docs/'
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            mkdirp(destinationDirectory,(err) =>{
                if (err) {
                    throw new Error(err)
                }
                else cb(null, destinationDirectory)
            });
        },
        filename: (req, file, cb) => {
            
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

        }
    })

function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || 
        magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif || 
        magic == MAGIC_NUMBERS.pdf) 
        return true
}


function uploadAndMap(req, res){
    return new Promise((resolve, reject) => {
        try{
            categoriesService.getByIdMongooseUse(req.params.uid)
            .then(async category => {
                const file = await uploadTheFile(req, res)

                fileService.createOne(file)
                    .then( ({_id}) => {
                        category.documents.push({_id})
                        resolve(category.save())
                    })
                    .catch(err => reject(err))
            })
        }
        catch(error){
            reject(error)
        }  
    })
}

function uploadTheFile(req, res){
    return new Promise((resolve, reject) => {
        const upload = multer({ storage: storage}).single('file');
            
            upload(req, res, (err) => {
                if (err) {
                    reject(err)
                }

                const bitmap = fs.readFileSync(destinationDirectory + req.file.filename).toString('hex', 0, 4);
                if (!checkMagicNumbers(bitmap)) {
                    fs.unlinkSync(destinationDirectory + req.file.filename);
                    reject(new Error('File not valid'))
                }
                else{
                    const { path, size } = req.file
                    const { name } = req.body
    
                    const file = { name, path, size }
                    
                    resolve(file)
                }
    
            });
    })
}

function justUpload(req, res){
    return new Promise(async (resolve, reject) => {
        try{
            const file = await uploadTheFile(req, res)
            resolve(fileService.createOne(file))
        }
        catch(error){
            reject(error)
        }
        
    })
    
}

module.exports = (req, res, next) => {
    const { uid } = req.params

    if (uid) {
        uploadAndMap(req, res).then(upload => res.json(upload))
        .catch( err => next(err))
    }
    else{
        justUpload(req, res).then(upload => res.json(upload))
            .catch( err => next(err))
    }
}