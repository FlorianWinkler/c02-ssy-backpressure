const express = require('express');
const router = express.Router();
const config = require('../src/config');
const util = require('../src/util');

router.get('/', getItem);
router.post('/', newItem);

let queue = [];

function newItem(req, resp) {
    if (util.tooManyRequests(10)){
        resp.status(429);
    }
    else if(queue.length > config.MAX_QUEUE_LENGTH){
        resp.status(503);
    }
    else{
        queue.push(req.body);
        resp.status(200);
    }
    resp.end();
}

function getItem(req, resp) {
    if (queue.length !== 0) {
        resp.json(queue.shift());
    } else {
        resp.status(204);
        resp.end();
    }
}

module.exports = router;
