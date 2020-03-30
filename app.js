var csv_parser = require('csv-parse/lib/sync')
var express = require('express');
var app = express();

var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request-promise');

async function getData() {
    var requestSettings = {
        method: 'GET',
        url: 'http://datamine.mta.info/mta_esi.php?key=d634f4431a43ad4a67c07eea9a3ce745&feed_id=16',
        encoding: null
    };
    var response = await request(requestSettings);
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response);
    return feed.entity
}

async function getStops() {
    var complexesRequestSettigns = {
        method: 'GET',
        url: 'http://web.mta.info/developers/data/nyct/subway/StationComplexes.csv',
        encoding: null
    }
    var complexesResponse = await request(complexesRequestSettigns);
    var complexesData = csv_parser(complexesResponse.toString(), {
        columns: true,
        skip_empty_lines: true
      });

    var stopsRequestSettigns = {
        method: 'GET',
        url: 'http://web.mta.info/developers/data/nyct/subway/Stations.csv',
        encoding: null
    }
    var stopsResponse = await request(stopsRequestSettigns);
    var stopsData = csv_parser(stopsResponse.toString(), {
        columns: true,
        skip_empty_lines: true
      });
    return {
        complexes: complexesData,
        stops: stopsData
    }
}

app.get("/", (req, res, next) => {
    getData()
        .then((data) => res.json(data))
});

app.get("/stops", (req, res, next) => {
    getStops()
        .then((data) => res.send(data))
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});