const fs = require('fs')
const db = require('./index')
const makeDistributionLine = require('../../entities/distribution-line')
const lines = fs.readFileSync(__dirname+'/distribution_lines.geojson')
const parsedLines = JSON.parse(lines)

describe('distribution lines service', () => {
    it('should add one line', async () => {

        const oneLine = parsedLines.features[Math.floor((Math.random() * 100) + 1)]

        const validLine = await makeDistributionLine(oneLine)

        const addedLine = await db.addNew(validLine)

        expect(addedLine).toBeTruthy()

    })
    it('should list all lines', async () => {
        const oneLine = parsedLines.features[Math.floor((Math.random() * 100) + 1)]

        const validLine = await makeDistributionLine(oneLine)

        const { _id } = await db.addNew(validLine)

        const listLines = await db.getAll()

        expect(listLines).toBeTruthy()

        const lastLine = listLines[listLines.length-1]

        expect(lastLine).toHaveProperty('_id', _id)
    })  
    
    
    it('get line by id', async () => {
        const oneLine = parsedLines.features[Math.floor((Math.random() * 100) + 1)]

        const validLine = await makeDistributionLine(oneLine)

        const {_id} = await db.addNew(validLine)

        const line = await db.getById(_id)

        expect(line).toBeTruthy()

        expect(line).toHaveProperty('_id', _id)
    })

    it('create lines bulk', async () => {
        const limit = Math.floor((Math.random() * 100) + 1)
        const features = parsedLines.features

        const lines = []

        features.forEach(async (feature, key) => {
            if (key < limit){
                const validLine = await makeDistributionLine(feature)
                lines.push(validLine)
            }
        });


        const dblines = await db.insertMany(lines)

        const line = await db.getById(dblines[limit-1]._id)

        expect(line).toBeTruthy()

        expect(dblines[limit-1]._id).toHaveProperty('_id', line._id)
    }) 
});
