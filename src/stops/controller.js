import MtaConnector from '../mta_data/MtaConnector'

class StopsController {

    constructor(connector) {
        this.connector = connector
    }

    async getStops() {
        let complexesData = await this.connector.getComplexes()
        let stopsData = await this.connector.getStops()

        return stopsData.map(stop => {
            return {
                id: parseInt(stop["Station ID"]),
                name: stop["Stop Name"],
                gtfs_stop_id: stop["GTFS Stop ID"],
                gtfs_geolocation: {
                    latitude: parseFloat(stop["GTFS Latitude"]),
                    longitude: parseFloat(stop["GTFS Longitude"])
                },
                lines: stop["Daytime Routes"].split(" ")
            }
        })
    }
}

export default StopsController