const express = require('express');
const db = require('../src/database');
const Request = require('request');
const router = express.Router();
const config = require('../src/config');


router.get('/:id', getItem);
router.get('/', getAll);

polling();

function getItem(req, res) {
    let item = db.sumCollection.findOne({id:req.params.id});
    res.json(item);
}

function getAll(req, res) {
    res.json(db.sumCollection.find());
}

function polling(){
    setTimeout(polling, config.WORKER_TIMEOUT);
    Request.get({
        url: 'http://127.0.0.1:3000/queue',
        json: true
    }, queueResponse);
}

function queueResponse(err, resp, body){
    if(resp.statusCode === 204){
        return;
    }
    // Objekt aus DB sieht so aus: { "id": "id4711", "number": 1234}
    let item = db.sumCollection.findOne({id: body.id});
    if (item === null){
        db.sumCollection.insert(body);
    }
    else{
        item.number += body.number;
        db.sumCollection.update(item);
    }

}


module.exports = router;
