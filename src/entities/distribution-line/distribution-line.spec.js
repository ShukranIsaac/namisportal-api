const makeDistributionLine = require('./')
const fs = require('fs')
const db = require('./index')
const lines = fs.readFileSync(__dirname+'/distribution_lines.geojson')
const parsedLines = JSON.parse(lines)

describe('distribution lines', () => {
    it("must have length", () => {
        const properties = {
            'Length (20': null
        }

        expect(makeDistributionLine({properties, geometry: {}}))
            .rejects
            .toMatchObject({message:"Distribution line must have length"})
    })

    it("must have lineType", () => {
        const properties = {
            Type5: null
        }
        expect(makeDistributionLine({properties, geometry: {}}))
            .rejects
            .toMatchObject({message:"Distribution line must have lineType"})
    })

    it("must have voltage", () => {
        const properties = {
            Voltage26: null
        }
        expect(makeDistributionLine({properties, geometry: {}}))
            .rejects
            .toMatchObject({message:"Distribution line must have voltage"})
    })

    it("must make a valid distributionline", async () => {
        const oneLine = parsedLines.features[Math.floor((Math.random() * 100) + 1)]

        const validLine = makeDistributionLine(oneLine)

        expect(validLine).toBeTruthy()
    })
});
