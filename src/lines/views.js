import request from 'request-promise'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'

import MtaConnector from '../mta_data/MtaConnector'
import StopsController from '../stops/controller'

const line_feeds = {
    "1": "1",
    "2": "1",
    "3": "1",
    "4": "1",
    "5": "1",
    "6": "1",
    "N": "16",
    "Q": "16",
    "R": "16",
    "W": "16",
}

export async function getLines(req, res) {
    var response = await requestLineData("1")
    res.json(response)
}

export async function getLinesNearby(req, res) {
    let latitude = req.query.lat
    let longitude = req.query.lon
    let stopsController = new StopsController(new MtaConnector())

    let stops = await stopsController.stopsNear(latitude, longitude)
    let feeds = new Set()
    let validStopIds = new Set()
    let result = {}
    stops.forEach(stop => {
        validStopIds.add(stop.gtfs_stop_id)
        stop.lines.forEach(line => {
            feeds.add(line_feeds[line])
            result[line] = []
        });
    })
    let requests = Array.from(feeds).map(requestLineData)
    let response = await Promise.all(requests)

    response.flat(1)
        .filter(item => item.tripUpdate && item.tripUpdate.stopTimeUpdate)
        .map(item => {
            return {
                line: item.tripUpdate.trip.routeId,
                stopTimeUpdate: item.tripUpdate.stopTimeUpdate
            }
        })
        .forEach(tripUpdate => {
            tripUpdate.stopTimeUpdate.forEach(stopTimeUpdate => {
                let stopId = stopTimeUpdate.stopId.slice(0, -1)
                let direction = stopTimeUpdate.stopId.slice(-1)
                let entry = result[tripUpdate.line]
                if (entry && validStopIds.has(stopId)) {
                    entry.push({
                        stopId: stopId,
                        direction: direction,
                        arrival: parseInt(stopTimeUpdate.arrival.time),
                        departure: parseInt(stopTimeUpdate.departure.time)
                    })
                }
            })
        })
    res.json(result)
}

async function requestLineData(feed_id) {
    var requestSettings = {
        method: 'GET',
        url: 'http://datamine.mta.info/mta_esi.php?key=d634f4431a43ad4a67c07eea9a3ce745&feed_id=' + feed_id,
        encoding: null
    };
    let response = await request(requestSettings);
    let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response);
    return feed.entity
}