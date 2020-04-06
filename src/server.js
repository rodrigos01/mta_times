'use strict';
import '@babel/polyfill';
import express from 'express'
import router from './routes'

let server = express();

server.use('/', router)
server.listen(3000, () => {
    console.log("Server running on port 3000");
});