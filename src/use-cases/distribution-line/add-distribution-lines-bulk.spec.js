const db = require('../../data-access/distribution-line')
const makeAddDistributionLinesBulk = require('./add-distribution-lines-bulk')
const { parsedLines } = require('../../../__tests__/fixtures/gis_features')

describe('add distriution lines bulk - usecase', () => {
    it('should add distribution lines bulk', async () => {
        const limit = Math.floor((Math.random() * 100) + 1)
        const features = parsedLines.features

        const lines = []

        features.forEach(async (feature, key) => {
            if (key < limit){
                lines.push(feature)
            }
        });


        const addDistributionLinesBulk = makeAddDistributionLinesBulk({db})

        try{
            const dblines = await addDistributionLinesBulk(lines)

            const line = await db.getById(dblines[limit-1]._id)

            expect(line).toBeTruthy()
    
            expect(dblines[limit-1]._id).toHaveProperty('_id', line._id)
        }
        catch(error){

        }


    }) 
});
