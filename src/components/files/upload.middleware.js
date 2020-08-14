const fs = require('fs');
const fstream = require('fstream')
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fileService = require('./service');
const categoriesService = require('../categories/service')
const stakeholdersServise = require('../stakeholders/service')
const unzip = require('unzip')
const zlib = require('zlib');
const Stakeholder = require('../stakeholders/model');
const Category = require('../categories/model');

const MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638',
    pdf: '25504446',
    zip: '504b0304'
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
        magic == MAGIC_NUMBERS.pdf || magic == MAGIC_NUMBERS.zip) 
        return true
}

function uploadAndMap(req, res){
    return new Promise(async (resolve, reject) => {
        try{
            const url = req.baseUrl.split('/')[1]
            if (url === 'stakeholders'){
                const directory = await stakeholdersServise.getById(req.params.uid)
                if(directory) {
                    const file = await uploadTheFile(req, res)
                    const created = await fileService.createOne(file)
                    if (created) {
                        await Stakeholder.update({ 
                            image: `/files/images/${created.dataValues.filename}` 
                        }, {
                            where: {_id: directory.dataValues._id}
                        })
                        resolve(await directory.reload())
                    } else {
                        reject(created)
                    }
                }

                directory.catch(error => reject(error))
            } else if(url === 'categories') {
                const category = await categoriesService.getById(req.params.uid)
                if(category) {
                    const file = await uploadTheFile(req, res)
                    const created = await fileService.createOne(file)
                    if (created) {
                        await category.addDocument(created)
                        
                        resolve(await category.reload())
                    } else {
                        reject(created)
                    }
                }

                category.catch(error => reject(error))
            } else {
                reject(new Error('Invalid URL, please check'))
            }
            
        } catch (error){
            reject(error)
        }  
    })
}

async function updateFile(req, res){
    if (req.file){
        const file = await uploadTheFile(req, res)
        const {name, ...fileWOname} = file

        try {
            const document = await fileService.getByIdMongooseUse(req.params.uid)
    
            return fileService.update(document, fileWOname)
                .then(updatedFile => Promise.resolve(updatedFile))
                .catch(error => Promise.reject(error))

        } catch (error) {
            return Promise.reject(error)
        }
    } else {
        try {
            const document = await fileService.getById(req.params.uid)

            return fileService.update(document, req.body)
                .then(updatedFile => Promise.resolve(updatedFile))
                .catch(error => Promise.reject(error))
    
        } catch (error) {
            return Promise.reject(error)
        }
    }
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
            } else {
                const { path, size, filename } = req.file
                
                let file = {}
                if (req.body){
                    const { name, description } = req.body
                    
                    file = { name, path, size, filename, description }
                } else {
                    file = { path, size, filename}
                }
                
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

async function readZip({file}){

    return new Promise((resolve, reject) => {

        const readStream = fs.createReadStream(file.path)
    
        readStream.pipe(unzip.Parse())
            .on('entry', function (entry) {
                const fileExtention = path.extname(entry.path)
                entry.autodrain()
                resolve({fileName: entry.path, type: entry.type, size: entry.size})
            })

        readStream.on('error', (err) => reject(err))
    })
}

async function unzipFile ({file, fileName}){
    const unzipp = zlib.createUnzip();
    const readStream = fs.createReadStream(file.path)
    const out = fs.createWriteStream(fileName)

    readStream
        .pipe(unzipp)
        // .pipe(fstream.Writer('docs'))
        .pipe(out)

    return readStream
}

function readExtracted({fileName}){
    try {
        const lines = fs.readFileSync(`${__dirname}/../../../docs/${fileName}`)
        const parsedLines = JSON.parse(lines)
        return Promise.resolve(parsedLines)
        
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = async (req, res, next) => {
    const { uid } = req.params
    const {method} = req

    //update file
    if (method === "PATCH"){
        try {
            const file = await fileService.getById(uid)

            if (file){
                return updateFile(req, res)
                    .then(updatedFile => res.json(updatedFile))
                    .catch(error => next(error))
            }
        } catch (error) {
            return next(error)
        }
    }

    if (uid) {
        uploadAndMap(req, res)
            .then(upload => res.json(upload))
            .catch( err => next(err))
    } else {
        const url = req.baseUrl.split('/')[1]

        if (url === 'files'){
            justUpload(req, res)
                .then(upload => res.json(upload))
                .catch( err => next(err))
        }
    }
}