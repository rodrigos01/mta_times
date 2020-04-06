import * as express from 'express'

import * as lines from './lines/views'
import * as stops from './stops/views'

let router = express.Router()

router.get('/', (req, res) => res.json({status: "OK"}))
router.get('/lines', lines.getLines)
router.get('/lines_nearby', lines.getLinesNearby)
router.get('/stops', stops.getStops)
router.get('/stops_nearby', stops.getStopsNear)

export default router