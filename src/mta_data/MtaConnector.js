import request from 'request-promise'
import csv_parser from 'csv-parse/lib/sync'

const apiKey = "d634f4431a43ad4a67c07eea9a3ce745"

class MtaConnector {
    async getComplexes() {
        let complexesRequestSettigns = {
            method: 'GET',
            url: 'http://web.mta.info/developers/data/nyct/subway/StationComplexes.csv',
            encoding: null
        }
        let complexesResponse = await request(complexesRequestSettigns);
        let complexesData = csv_parser(complexesResponse.toString(), {
            columns: true,
            skip_empty_lines: true
          });
        return complexesData
    }

    async getStops() {
        let stopsRequestSettigns = {
            method: 'GET',
            url: 'http://web.mta.info/developers/data/nyct/subway/Stations.csv',
            encoding: null
        }
        let stopsResponse = await request(stopsRequestSettigns);
        let stopsData = csv_parser(stopsResponse.toString(), {
            columns: true,
            skip_empty_lines: true
          });
        return stopsData
    }
}

export default MtaConnector