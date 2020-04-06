import request from 'request-promise'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'

export async function getLines() {
    var requestSettings = {
        method: 'GET',
        url: 'http://datamine.mta.info/mta_esi.php?key=d634f4431a43ad4a67c07eea9a3ce745&feed_id=16',
        encoding: null
    };
    var response = await request(requestSettings);
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response);
    return feed.entity
}