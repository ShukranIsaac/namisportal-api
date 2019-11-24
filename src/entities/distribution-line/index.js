const buildMakeDistribustionLine = require('./distribution-line')

const makeDistribustionLine = buildMakeDistribustionLine({mapPolyLinesCoords})

function mapPolyLinesCoords(coordinates){
    
    return coordinates.map((coordinate) => {
        return coordinate.map((coor) => {
            return mapCoordinates(coor)
        })
    })
}

function mapCoordinates(coordinates){
    return {
        lat: coordinates[1],
        lng: coordinates[0]
    }
}

module.exports = makeDistribustionLine