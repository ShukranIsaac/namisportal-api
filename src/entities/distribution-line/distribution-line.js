const buildMakeDistribustionLine = ({mapPolyLinesCoords}) => {

    return ({properties, geometry}) => {
        const {district, Feeder2, Status3, Voltage26, region, Conducto1, Type5, Substati17} = properties;
        const { coordinates, type } = geometry;
    
        const length = properties['Length (20']
    
        if (!length){
            return Promise.reject(new Error("Distribution line must have length"))
        }
    
        if (!Type5){
            return Promise.reject(new Error("Distribution line must have lineType"))
        }
    
        if (!Voltage26){
            return Promise.reject(new Error("Distribution line must have lineType"))
        }
    
        return Promise.resolve(
            Object.freeze({
                properties: {
                    length,
                    district, 
                    length, 
                    region,
                    primary: properties['Primary 4'],
                    feeder: Feeder2,
                    status: Status3,
                    conductor: Conducto1,
                    voltage: Voltage26,
                    lineType: Type5,
                    substation: Substati17
                },  
                geometry: {
                    type,
                    coordinates: mapPolyLinesCoords(coordinates)
                },
                lines: {
                    type, coordinates
                }
            })
        )
    }
} 

module.exports = buildMakeDistribustionLine