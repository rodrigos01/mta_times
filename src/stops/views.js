import MtaConnector from '../mta_data/MtaConnector'
import StopsController from './controller'

let connector = new MtaConnector()
let controller = new StopsController(connector)

export async function getStops(request, response) {
    let stops = await controller.getStops()
    response.json(stops)
}

export async function getStopsNear(request, response) {
    let latitude = parseFloat(request.query.lat)
    let longitude = parseFloat(request.query.lon)
    let stops = await controller.stopsNear(latitude, longitude)
    response.json(stops)
}