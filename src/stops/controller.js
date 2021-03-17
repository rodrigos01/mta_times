import MtaConnector from '../mta_data/MtaConnector'
import * as geolib from 'geolib'

class StopsController {

    constructor(connector) {
        this.connector = connector
    }

    async getStops() {
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
                lines: stop["Daytime Routes"].split(" "),
                direction_labels: {
                    "S": stop["South Direction Label"],
                    "N": stop["North Direction Label"]
                }
            }
        })
    }

    async stopsNear(latitude, longitude) {
        let stops = await this.getStops()
        return stops.filter(stop => {
            let withinRadius = geolib.isPointWithinRadius(stop.gtfs_geolocation, { latitude: latitude, longitude: longitude }, 500)
            return withinRadius
        })
    }
}

export default StopsController