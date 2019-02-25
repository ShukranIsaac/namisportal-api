const fs = require("fs")
const mongoose = require('mongoose')
const db = mongoose.connection;


const powerPlantsJSON = fs.readFileSync(__dirname + '/power_plants.geojson')
const parsedPowerPlants = JSON.parse(powerPlantsJSON)

const marepCentersJSON = fs.readFileSync(__dirname + '/marep_centres.geojson')
const marepCenters = JSON.parse(marepCentersJSON)

const regionsJSON = fs.readFileSync(__dirname + '/regions.json')
const parsedRegionPolygons = JSON.parse(regionsJSON)

const districtsJSON = fs.readFileSync(__dirname + '/d_centroids.json')
const parsedDistricts = JSON.parse(districtsJSON)

const districtPolygonsJSON = fs.readFileSync(__dirname + '/districts.json')
const parsedDistrictPolygons = JSON.parse(districtPolygonsJSON)

const transformersJSON = fs.readFileSync(__dirname + '/escom_transfomers.geojson')
const parsedTransformers = JSON.parse(transformersJSON)

const distributionLinesJSON= fs.readFileSync(__dirname + '/distribution_lines.geojson')
const parsedDistributionLines = JSON.parse(distributionLinesJSON)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>  console.info('connekitedi'));
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

const DistributionLines = require('../components/gis/distribution-lines/model')
const PowerPlant = require('../components/gis/power-plants/model')
const MarepCenter = require('../components/gis/marep-centers/model')
const Transformer = require('../components/gis/transformers/model')
const District = require('../components/gis/districts/model')
const Polygon = require('../components/gis/polygons/model')
const Region = require('../components/gis/regions/model')

//MarepCenter.collection.drop();

const districts = ['Chitipa', 'Karonga', 'Likoma', 'Mzimba', 'Nkhatabay', 'Rumphi', 'Dedza', 'Dowa', 'Kasungu', 'Lilongwe', 'Mchinji', 'Nkhotakota', 'Ntcheu', 'Ntchisi', 'Salima', 'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Machinga', 'Mangochi', 'Mulanje', 'Mwanza', 'Neno', 'Nsanje', 'Phalombe', 'Thyolo', 'Zomba']
const regionDistricts = [
    {
      name: "Northern Region",
      districts: ["Chitipa","Karonga","Rumphi","Mzimba","Nkhatabay","Likoma"]
    },
    {
      name: "Central Region",
      districts: ["Lilongwe","Kasungu","Dowa","Mchinji","Ntchisi","Dedza","Ntcheu","Nkhotakota","Salima"]
    },
    {
      name: "Southern Region",
      districts: ["Blantyre","Chikwawa","Chiradzulu","Mulanje","Mwanza","Nsanje","Phalombe","Thyolo","Neno","Balaka","Machinga","Mangochi","Zomba"]
    },
  ];


// const transformedDistLines = transformDistributionLines(parsedDistributionLines.features)
// const districtDistLines =  mapLinesToDistrict(districts, transformedDistLines)

// const mappedCenters = mapCenters(marepCenters.features)
// mapCentersToDistrict(districts, mappedCenters)

// const polygs = transformPolygons(parsedDistrictPolygons.features)
// polgonsToMongo(districts, polygs)

// const cleanedDistricts = cleanDistricts(parsedDistricts)
// const mongoDistricts = districtsToMongo(parsedDistricts)

//console.log(mongoDistricts)

// const polygs = transformRegionPolygons(parsedRegionPolygons.features)
// regionPolgonsToMongo(polygs)

// mapDistrictsToRegions(regionDistricts)

// const mappedTransformers = mapTransformers(parsedTransformers.features)
// mapTransformersToDistrict(districts, mappedTransformers)


const mappedPowerPlants = mapPowerPlants(parsedPowerPlants.features)
mapPowerPlantsToDistrict(districts, mappedPowerPlants)

// regionsToMongo(regionDistricts)


//power plants stuffies
function mapPowerPlants(powerPlants){
    return powerPlants.map((powerPlant) => {

        const { geometry: { type , coordinates}, properties: {region, district, ta, PlantName, status, TypeOfPlant} } = powerPlant
        const newCoordinate =  mapCoordinates(coordinates)
        
        const powerPlantObj = {
            properties: {
                region, ta, status,
                capacityInMW: powerPlant.properties['Capacity(MW)'],
                district: capitalize(district), 
                plantType: TypeOfPlant,
                name: PlantName,
                feature: 'Point',
            
            },
            geometry: {
                _type: type,
                coordinates: newCoordinate
            }
        }

        return powerPlantObj
    })
}

function mapPowerPlantsToDistrict(districts, powerPlants){
    return districts.map((district) => {
        const districtPowerPlants = powerPlants.filter((powerPlant) => powerPlant.properties.district === district)
        
        if (districtPowerPlants.length > 0){
            PowerPlant.collection.insertMany(districtPowerPlants, (err, {insertedIds}) => {
                if (err) throw new Error(err)
                const values = Object.values(insertedIds)
    
                District.findOne({properties: {name: district}})
                    .then(districtFromMongo => {
                        districtFromMongo.powerPlants.push(...values)
                        districtFromMongo.save()
                            .then(saved => console.log(saved))
                            .catch(err => console.error(err))
                    })
                    .catch(err => console.error(err))
            })
        }
    })
}

//transformers stuffies
function mapTransformers(transformers){
    return transformers.map((transformer) => {

        const { geometry: { type , coordinates}, properties: {region, district, ta} } = transformer
        const newCoordinate =  mapCoordinates(coordinates)
        
        const transformerObj = {
            properties: {
                station: transformer.properties.station8,
                mass: transformer.properties['mass(kg)28'],
                voltage: transformer.properties.voltage38,
                MVARating: transformer.properties['mva rati40'],
                yearManufactured: transformer.properties['year man44'],
                manufacturer: transformer.properties.manufact41,
                district: capitalize(district), 
                region, ta,
                feature: 'Point',
                primary: transformer.properties['primary 10'],
                position: transformer.properties.position27,
                feeder: transformer.properties.feeder6,
                location: transformer.properties.location46,
                barcode: transformer.properties.barcode25,
                serialNumber: transformer.properties['serial n32'],
                cooling: transformer.properties.cooling22,
                SSNumber: transformer.properties['ss numbe12'],
                summable: transformer.properties.summable14,
                oilVolume: transformer.properties['oil volu21']
            },
            geometry: {
                _type: type,
                coordinates: newCoordinate
            }
        }

        return transformerObj
    })
}

function mapTransformersToDistrict(districts, transformers){
    return districts.map((district) => {
        const districtTransformers = transformers.filter((transformer) => transformer.properties.district === district)
        
        if (districtTransformers.length > 0){
            Transformer.collection.insertMany(districtTransformers, (err, {insertedIds}) => {
                if (err) throw new Error(err)
                const values = Object.values(insertedIds)
    
                District.findOne({properties: {name: district}})
                    .then(districtFromMongo => {
                        districtFromMongo.transformers.push(...values)
                        districtFromMongo.save()
                            .then(saved => console.log(saved))
                            .catch(err => console.error(err))
                    })
                    .catch(err => console.error(err))
            })
        }
    })
}

// marep centers stuffioes
function mapCenters(centers){
    return centers.map((center) => {

        
        
        const { geometry: { type , coordinates}, properties: {region, ta, district} } = center
        const newCoordinate =  mapCoordinates(coordinates)
        
        const centerObj = {
            properties: {
                region, district: capitalize(district), ta
            },
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

function capitalize(s){
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function mapCentersToDistrict(districts, centers){
    return districts.map((district) => {
        const districtCenters = centers.filter(({properties}) => properties.district == district )

        if (districtCenters.length > 0){
            MarepCenter.collection.insertMany(districtCenters, (err, {insertedIds}) => {
                if (err) throw new Error(err)
    
                    const values = Object.values(insertedIds)
    
                    District.findOne({properties: {name: district}})
                        .then(districtFromMongo => {
                            districtFromMongo.marepCenters.push(...values)
                            districtFromMongo.save()
                                .then(saved => console.log(saved))
                                .catch(err => console.error(err))
                        })
                        .catch(err => console.error(err))
                
            })
        }
        
        
    })
}


// Regions stuffies
function cleanRegions( regions ) {
    return regions.map(({name}) => { 
        return {properties: {name}}
    })
}

function regionsToMongo( dirtyRegions ){
    const regions = cleanRegions(dirtyRegions)
    Region.insertMany(regions).then(regions => { console.log(regions)})
}

function mapDistrictsToRegions(regions){
    
    return regions.map(async region => {
        const districts = await District.find({'properties.name': { $in:  region.districts}}, '_id').lean()
        const idsOfRegionsDistricts = districts.reduce((districtsIds, district) => {
            districtsIds.push(district._id)
            return districtsIds
        }, [])

        Region.find({properties: {name: region.name}}).limit(1)
        .then((foundRegion => {
            foundRegion[0].districts.push(...idsOfRegionsDistricts)
            foundRegion[0].save().then(region => console.log(region)).catch()
        }))
        
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
           
            return coordinates.map(polygon => { 
                const res = {
                    district,
                    geometry: {
                        _type: 'Polygon',
                        coordinates: mapPolygonCoordinates(polygon)
                    }
                } 
                
                return res
            })
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




//TODO map polygons to regiion
/**
 * 1 transform region polygons to goodly format
 *      - remember polygon geometry coordinate features are arrays of polygons
 * 2 bulk insert polgons to database
 * 3 map each polygon to its regions
 */
function transformRegionPolygons(polygons) {
    return polygons.map(polygon => {
        const {geometry: {coordinates, type}, properties: {region}} = polygon

        return coordinates.map(polygon => { 
            const res = {
                region,
                geometry: {
                    _type: 'Polygon',
                    coordinates: mapPolygonCoordinates(polygon)
                }
            } 
            
            return res
        })
        
    })
}

function mapPolygonCoordinates(polygons){
    return polygons.map( polygon => {
        return polygon.map((coordinates) => {
            return mapCoordinates(coordinates)
        })
    })
}

function regionPolgonsToMongo(polygons){
    const regions = ['Northern Region', 'Central Region', 'Southern Region']
    return regions.map(region => {
        const reducedPolygons = reduceMult(polygons)
        const regionPolygons = reducedPolygons.filter((polygon) => polygon.region === region)
        
        return Polygon.collection.insertMany(regionPolygons, (err, {insertedIds}) => {
                if (err) throw new Error(err)
                const values = Object.values(insertedIds)
                
                Region.find({properties: {name: region}}).limit(1)
                .then(region => {
                    region[0].polygons.push(...values)
                    region[0].save()
                    .then(region => console.log(region))
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