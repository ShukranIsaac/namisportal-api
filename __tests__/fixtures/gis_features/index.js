const fs = require('fs')
const lines = fs.readFileSync(__dirname+'/distribution_lines.geojson')
const parsedLines = JSON.parse(lines)

module.exports = { parsedLines }
