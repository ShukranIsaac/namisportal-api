const fs = require('fs')
const lines = fs.readFileSync(__dirname+'/distribution_lines.geojson')
const parsedLines = JSON.parse(lines)

// const limit = Math.floor((Math.random() * 100) + 1)
// const features = parsedLines.features

// const newlines = []

// // features.forEach(async (feature, key) => {
// //     if (key < limit){
// //         newlines.push(feature)
// //     }
// // });



// fs.appendFile('mynewfile2.geojson', JSON.stringify(features), function (err) {
//     if (err) throw err;
//     console.log('Saved!');
// });

module.exports = { parsedLines }
