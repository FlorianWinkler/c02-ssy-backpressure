const Request = require('request');
const config = require('../src/config');
const util = require('../src/util');

sendMessage(1,0);

function sendMessage(number, retry) {
    if(retry===0) {
        setTimeout(sendMessage, config.CLIENT_TIMEOUT, number + 1, 0);
    }
    Request.post({
        url: 'http://127.0.0.1:3000/queue',
        json: {
            id: util.randomId(10),
            number: number
        }
    }, response);

    function response(error, response, body) {
        console.log("Message: " + number + ", Status: " + response.statusCode);
        if (response.status === 503){
            if (retry >= 3){
                console.log('Message '+ number + " failed");
            }
            else {
                setTimeout(sendMessage, config.CLIENT_TIMEOUT*((retry+2)^2),number, retry+1);
            }

        }
    }
}
