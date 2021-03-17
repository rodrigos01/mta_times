import request from 'request-promise'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'

import MtaConnector from '../mta_data/MtaConnector'
import StopsController from '../stops/controller'

const line_feeds = {
    "A": "ace",
    "C": "ace",
    "E": "ace",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "N": "nqrw",
    "Q": "nqrw",
    "R": "nqrw",
    "W": "nqrw",
    "B": "bdfm",
    "D": "bdfm",
    "F": "bdfm",
    "M": "bdfm",
    "G": "g",
    "J": "jz",
    "Z": "jz",
    "L": "l",
    "7": "7",
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
    let result = {
        stops: stops,
        times: {}
    }
    stops.forEach(stop => {
        validStopIds.add(stop.gtfs_stop_id)
        stop.lines.forEach(line => {
            feeds.add(line_feeds[line])
            result.times[line] = []
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
                let entry = result.times[tripUpdate.line]
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
    if (feed_id !== "") {
        feed_id = "-" + feed_id
    }
    var requestSettings = {
        method: 'GET',
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs' + feed_id,
        headers: {
            "x-api-key": "ZeO8MqUTUs4W4E7XQ7sKE3i84niMLd753HZCjXhE"
        },
        encoding: null
    };
    let response = await request(requestSettings);
    let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response);
    return feed.entity
}