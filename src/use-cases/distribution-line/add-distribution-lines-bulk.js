const makeDistributionLine = require('../../entities/distribution-line')

function makeAddDistributionLinesBulk({db}){
    return async function addDistributionLinesBulk(features){
        const lines = features.map(async (feature) => {
            const validLine = await makeDistributionLine(feature)
            return validLine
        });
        
        try {
            return await db.insertMany(lines)           
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

module.exports = makeAddDistributionLinesBulk