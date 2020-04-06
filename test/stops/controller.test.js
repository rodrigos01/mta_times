import '@babel/polyfill';
import assert from 'assert'
import StopsController from '../../src/stops/controller'
import MtaConnector from '../../src/mta_data/MtaConnector'
import fs from 'fs'

const mockData = JSON.parse(fs.readFileSync('test/test_data.json'))
const mockGetStops = jest.fn()
mockGetStops.mockReturnValue(mockData.stops)
const mockGetComplexes = jest.fn()
mockGetComplexes.mockReturnValue(mockData.complexes)
const mockConnector = {
    getStops: () => mockData.stops,
    getComplexes: () => mockData.complexes
}

test('should transform stop', async () => {
    let controller = new StopsController(mockConnector)
    let stops = await controller.getStops()
    expect(stops[0]).toEqual(
        {
            id: 1,
            name: "Astoria - Ditmars Blvd",
            gtfs_stop_ids: [
                "R01"
            ],
            gtfs_geolocation: {
                latitude: 40.775036,
                longitude: -73.912034
            },
            lines: ["N", "W"]
        }
    )
})