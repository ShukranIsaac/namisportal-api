const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const File = require('../modules/files/file.model.js');
const Paper = require('../modules/papers/papers.model.js');

const category = 'tutu';
const dayi = './cods/' + category + '/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        mkdirp(dayi, (err) =>{
            if (err) throw new Error(err)
            else cb(null, dayi)
        });
    },
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
})

const MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638',
    pdf: '25504446'
}

function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || 
        magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif || 
        magic == MAGIC_NUMBERS.pdf) 
        return true
}

module.exports = (req, res, next) => {
    const upload = multer({ storage: storage }).single('file');
    
    upload(req, res, (err) => {
        if (err) return next(err);
        const bitmap = fs.readFileSync(dayi + req.file.filename).toString('hex', 0, 4);
        if (!checkMagicNumbers(bitmap)) {
            fs.unlinkSync(dayi + req.file.filename);
            res.end('File is no valid');
            next();
        }
        File.belongsTo(Paper);

        let paperId = req.paper.dataValues.id;
        let leFile = {
            name: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            paperId: paperId
        }

        File.create(leFile,{include: [Paper]})
        .then((created) => {
            res.json(created);
        });

    });

}