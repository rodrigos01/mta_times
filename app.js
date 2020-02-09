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

app.get("/", (req, res, next) => {
    getData()
        .then((data) => res.json(data))
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});