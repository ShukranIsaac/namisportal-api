const fs = require("fs")
const mongoose = require('mongoose')
const db = mongoose.connection;


const marepCentersJSON = fs.readFileSync(`${__dirname}/marep.json`)
const marepCenters = JSON.parse(marepCentersJSON)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>  console.info('connekitedi'));
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })



const MarepCenter = require('../../components/gis/marep-centers/model')
const District = require('../../components/gis/districts/model')

const districts= ['Chitipa', 'Karonga', 'Likoma', 'Mzimba', 'Nkhatabay', 'Rumphi', 'Dedza', 'Dowa', 'Kasungu', 'Lilongwe', 'Mchinji', 'Nkhotakota', 'Ntcheu', 'Ntchisi', 'Salima', 'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Machinga', 'Mangochi', 'Mulanje', 'Mwanza', 'Neno', 'Nsanje', 'Phalombe', 'Thyolo', 'Zomba']

const mappedCenters = mapCenters(marepCenters.features)
mapCentersToDistrict(districts, mappedCenters)


function mapCenters(centers){
    return centers.map((center) => {

        const { geometry: { type , coordinates}, properties: {ta, ghv, village, district} } = center
        const newCoordinate =  mapCoordinates(coordinates)
        
        const centerObj = {
            properties: {
                district
            },
            geometry: {
                _type: type,
                coordinates: newCoordinate
            }
        }
        return centerObj
    })
}

function mapCentersToDistrict(districts, centers){
    return districts.map((district) => {
        const districtCenters = centers.filter(({properties}) => properties.district === district)

        return MarepCenter.collection.insertMany(districtCenters, (err, docs) => {
            if (err) console.error(err);
            const tometing = docs
            return console.log(tometing.ops)
            const values = Object.values(insertedIds)

            co(function*() {
                const districtCursor = District.find({properties: {name: district}}).limit(1).cursor()
                for (let doc = yield districtCursor.next(); doc != null; doc = yield districtCursor.next()) {
                    doc.marepCenters.push(...values)
                    doc.save()
                    //console.log(doc)
                }
                    
            })

        })
    })
}

function mapCoordinates(coordinates) {
    return {
        lat: coordinates[1],
        lng: coordinates[0]
    }
}
