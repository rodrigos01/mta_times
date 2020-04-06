import StopsController from './controller'

let controller = new StopsController()

export async function getStops(request, response) {
    let stops = await controller.getStops()
    response.json(stops)
}