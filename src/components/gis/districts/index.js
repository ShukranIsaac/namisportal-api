//TODO
// use async await for crud requests
// create separate routes file
// make script for loading gis data
// make proper endpoints for districts and marep centers
// make transormer, distribution lines, regions, meters models
// find goodly commenting library
// compresss json response
// make goodly README file
// find out how to draww directory structure

const District = require('./model')
const Polygon = require('../polygons/model')
const express = require('express')

const fs = require("fs");
const polygonJson = fs.readFileSync(__dirname + '/polygon.test.json')
const docPolygon = JSON.parse(polygonJson)

module.exports = {
    get: async (req, res, next) => {
        const opts = [
            { path: 'marepCenters', select: 'geometry' }
          , { path: 'polygons' }
        ]
        const result = await District.find({})//.populate(opts).exec()

        res.json(result)
    }
}



