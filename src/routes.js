import * as express from 'express'

import * as lines from './lines/views'
import * as stops from './stops/views'

let router = express.Router()

router.get('/', (req, res) => res.json({status: "OK"}))
router.get('/lines', (req, res) => res.json(lines.getLines()))
router.get('/stops', stops.getStops)

export default router