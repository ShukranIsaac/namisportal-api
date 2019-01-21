const fs = require("fs")
const mongoose = require('mongoose')
const db = mongoose.connection;


const marepCentersJSON = fs.readFileSync(__dirname + '/marep.json')
const marepCenters = JSON.parse(marepCentersJSON)

const districtsJSON = fs.readFileSync(__dirname + '/d_centroids.json')
const parsedDistricts = JSON.parse(districtsJSON)

const districtPolygonsJSON = fs.readFileSync(__dirname + '/districts.json')
const parsedDistrictPolygons = JSON.parse(districtPolygonsJSON)

const distributionLinesJSON= fs.readFileSync(__dirname + '/distribution_lines.geojson')
const parsedDistributionLines = JSON.parse(distributionLinesJSON)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>  console.info('connekitedi'));
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

const DistributionLines = require('../components/gis/distribution-lines/model')
const MarepCenter = require('../components/gis/marep-centers/model')
const District = require('../components/gis/districts/model')
const Polygon = require('../components/gis/polygons/model')

//MarepCenter.collection.drop();

const districts = ['Chitipa', 'Karonga', 'Likoma', 'Mzimba', 'Nkhatabay', 'Rumphi', 'Dedza', 'Dowa', 'Kasungu', 'Lilongwe', 'Mchinji', 'Nkhotakota', 'Ntcheu', 'Ntchisi', 'Salima', 'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Machinga', 'Mangochi', 'Mulanje', 'Mwanza', 'Neno', 'Nsanje', 'Phalombe', 'Thyolo', 'Zomba']

// const transformedDistLines = transformDistributionLines(parsedDistributionLines.features)
// const districtDistLines =  mapLinesToDistrict(districts, transformedDistLines)

//const mappedCenters = mapCenters(marepCenters.features)
//mapCentersToDistrict(districts, mappedCenters)

const polygs = transformPolygons(parsedDistrictPolygons.features)
polgonsToMongo(districts, polygs)

// // const cleanedDistricts = cleanDistricts(parsedDistricts)
//const mongoDistricts = districtsToMongo(parsedDistricts)

//console.log(mongoDistricts)


function mapCenters(centers){
    return centers.map((center) => {

        const { geometry: { type , coordinates}, properties: {ta, ghv, village, district} } = center
        const newCoordinate =  mapCoordinates(coordinates)
        
        const centerObj = {
            district,
            properties: {},
            geometry: {
                _type: type,
                coordinates: newCoordinate
            }
        }

        return centerObj
    })
}

function mapCoordinates(coordinates){
    return {
        lat: coordinates[1],
        lng: coordinates[0]
    }
}

function mapCentersToDistrict(districts, centers){
    return districts.map((district) => {
        const districtCenters = centers.filter((center) => center.district === district)
        
        return districtCenters.map(async (center) => {
            const { properties, geometry } = center;
            const { _id } = await MarepCenter.create({geometry, properties})

            //console.log(_id)

            District.find({properties: {name: district}})
                .then(district => {
                    district[0].marepCenters.push({_id})

                    district[0].save()
                    .then(center => console.log(center))
                    .catch(err => console.error(err))
                }).catch(err => console.error(err))
        })
        
    })
}



function cleanDistricts( districts ) {
    return districts.map(district => {
        const obj = {
            properties: {
                name: district.district
            },
            centroids: district.coordinates
        }
        return obj
    })
}

function districtsToMongo( dirtyDistricts ){
    const districts = cleanDistricts(dirtyDistricts)
    //console.log(districts)
    District.insertMany(districts).then(districts => { console.log(districts)})
}


//TODO map polygons to district
/**
 * 1 transform district polygons to goodly format
 *      - remember polygon geometry coordinate features are arrays of polygons
 * 2 bulk insert polgons to database
 * 3 map each polygon to its district
 */
function transformPolygons(polygons) {
    return polygons.map(polygon => {
        const {geometry: {coordinates, type}} = polygon
        const district = polygon.properties.name_1

        if (type === 'MultiPolygon'){
           
            const ply=  coordinates.map(polygon => { 
                const res = {
                    district,
                    geometry: {
                        _type: 'Polygon',
                        coordinates: mapPolygonCoordinates(polygon)
                    }
                } 
                
                return res
            })
            //console.log(ply)
            return ply
        }else{
            const res = {
                district,
                geometry: {
                    _type: 'Polygon',
                    coordinates: mapPolygonCoordinates(coordinates)
                }
            }
            //console.log(res)
            return res
        }
        
    })
}

function mapPolygonCoordinates(polygons){
    return polygons.map( polygon => {
        return polygon.map((coordinates) => {
            return mapCoordinates(coordinates)
        })
    })
}

function reduceMult(multi){
    return multi.reduce((polygons, polygon) => {
        if (polygon.constructor === Array){
            
            polygon.forEach(element => {
                polygons.push(element)
                
            });

            return polygons
        }
        else{
            polygons.push(polygon)
            return polygons
        }
    }, [])
}

function polgonsToMongo(districts, polygons){
    return districts.map(district => {
        const reducedPolygons = reduceMult(polygons)
        const districtPolygons = reducedPolygons.filter((polygon) => polygon.district === district)// || polygons.filter(polygon => polygon.constructor === Array)
        //console.log(districtPolygons)
        return districtPolygons.map(async polygon => {
            const { geometry } = polygon;
            const { _id } = await Polygon.create({geometry})
            //console.log(_id)
            District.find({properties: {name: district}})
            .then(district => {
                district[0].polygons.push({_id})
                //console.log(district[0].polygons)
                district[0].save()
                .then(district => console.log(district))
                .catch(err => console.error(err))
            }).catch(err => console.error(err))
        })
    })
}




//TODO distribution lines
/**
 * 1. transform the lines
 * 2. bulk insert of multilines to db
 * 3. map lines to districts
 */

function mapLinesToDistrict(districts, lines){
    const co = require('co');


    return districts.map((district) => {
        const districtlines = lines.filter((line) => line.properties.district === district)
        
        if (districtlines.length > 0){
            //console.log(districtlines[0].geometry.coordinates)

            try {
                DistributionLines.collection.insertMany(districtlines, (err, docs) => {
                    if (err) throw new Error(err)
                    const values = Object.values(docs.insertedIds)

                    co(function*() {
                        const districtCursor = District.find({properties: {name: district}}).limit(1).cursor()
                        for (let doc = yield districtCursor.next(); doc != null; doc = yield districtCursor.next()) {
                            doc.distributionLines.push(...values)
                            doc.save()
                            console.log(doc)
                        }
                            
                    })

                })
                // return  districtlines.map(async line => {
                    
                //     await DistributionLines.collection.insertOne(line, (err, {ops: [{_id, properties}]})=>{
                //         //console.log(properties)
                //             co(function*() {
                //                 const districtCursor = District.find({properties: {name: district}}).limit(1).cursor()
                //                 for (let doc = yield districtCursor.next(); doc != null; doc = yield districtCursor.next()) {
                //                     doc.distributionLines.push({_id})
                //                     doc.save()
                //                     console.log(doc)
                //                     delete db.collections['district'];
                //                 }
                //                 delete db.collections['distribution_lines']
                                    
                //             })
                           
                            
                //             // var stream = District.find({properties: {name: district}}).lean().stream();   // however you call

                //             // stream.on("data", (doc) => {
                //             //     // call pause on entry
                //             //     //stream.pause();
                //             //     doc.distributionLines.push({_id})
                //             //     doc.save()
                //             //     console.log(doc)
                //             //     // do processing
                //             //    // stream.resume();            // then resume when done
                //             // }).on('finish', () => console.log('finished'))
                        
                //     })
                    
                // })
            }
            catch(error){
                console.error(error)
            }
            //  const dlines = districtlines.map(line => {
            //     DistributionLines.collection.insert(line, (err, {ops: [{properties, _id}]})=>{
            //         console.log(_id, properties)
            //     })
                
                
            //     //const districtCursor = District.find({properties: {name: 'Zomba'}}).cursor()
                
                
            //     // districtCursor.on('data', async mongoDistrict => {
            //     //     mongoDistrict.distributionLines.push({_id})
            //     //     const savedDistrict = await mongoDistrict.save()
            //     //     console.log(savedDistrict)
            //     // }).on('close', () => {
            //     //     console.log('Data insertion ended')
            //     // })
                

                
            //     // .then(mongoDistrict => {
            //     //     mongoDistrict[0].distributionLines.push({_id})
            //     //     //console.log(mongoDistrict[0].distributionLines)
            //     //     mongoDistrict[0].save()
            //     //     .then(distLine => console.log(distLine))
            //     //     .catch(err => console.error(err))
            //     // }).catch(err => console.error(err))
            // })
            // return dlines
        }
        /*const { properties: {length}, geometry} = districtlines
        let res = {
            properties: {
                district, length
            },
            geometry
        }
        console.log(res)
        return res;*/
    })
}

function mapPolyLinesCoords(coordinates){
    
    return coordinates.map((coordinate) => {
        return coordinate.map((coor) => {
            return mapCoordinates(coor)
        })
    })
}

function transformDistributionLines(features){
    //console.log(features)
    return features.map((feature, key) => {
        const {district, Feeder2, Status3, Voltage26, region, Conducto1} = feature.properties;
        const length = feature.properties['Length (20'];
        const { coordinates, type } =  feature.geometry;
        const res = {
            properties: {
                district, length, region,
                feeder: Feeder2,
                status: Status3,
                conductor: Conducto1,
                voltage: Voltage26
            },  
            geometry: {
                coordinates: mapPolyLinesCoords(coordinates),
                _type: type
            }
            
        }

        return res;
    })
}