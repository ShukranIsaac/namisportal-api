const PowerPlant = require('./model')

module.exports = {
    getAll: async (query=null) => {
        
        const { capacity, plantType} = query
        if (capacity === undefined && plantType === undefined){
            return await PowerPlant.find({}).lean()
        }
        if (capacity === 'below 50MW'){
            return await PowerPlant.find({'properties.capacityInMW':{$lt: 50}}).lean() 
        }
        
        if(capacity === 'above 50MW'){
            return await PowerPlant.find({'properties.capacityInMW':{$gt: 50}}).lean() 
        }
        
        if(plantType !== null){
            return await PowerPlant.find({'properties.plantType': plantType}).lean()
        } 
    },
    getById: async (id) => await PowerPlant.findById(id).lean(),
    getPlantTypes: async () => await PowerPlant.find({}).select({'properties.plantType': 1}).lean(),
    getCapacities: async () => await PowerPlant.find({}).select({'properties.capacityInMW': 1}).lean()
}



