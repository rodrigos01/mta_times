import MtaConnector from '../mta_data/MtaConnector'
import StopsController from './controller'

let connector = new MtaConnector()
let controller = new StopsController(connector)

export async function getStops(request, response) {
    let stops = await controller.getStops()
    response.json(stops)
}