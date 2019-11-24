const makeDistributionLine = require('./')

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
});
