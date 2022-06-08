const WebSocket = require('ws');
const uuidv1 = require('uuid/v1')
const fs = require('fs')
const wss = new WebSocket.Server({ port: 5501 });

let userOnServer = [];
let response = {};

wss.on('connection', function connection(ws) {
    const clientId = uuidv1();
    userOnServer = [...userOnServer, clientId];

    ws.on('message', function incoming(message) {
        const request = JSON.parse(message);
        console.log(request)
        switch (request.type) {
            case 'LOGIN':
                response = {
                    type: 'LOGIN_RESPONSE',
                    payload: {
                        clientId: clientId
                    }
                }
                ws.send(JSON.stringify(response))
                break;
            case 'LOGOUT':
                response = {
                    type: 'LOGOUT_RESPONSE',
                    payload: {
                        clientId: clientId
                    }
                }
                ws.send(JSON.stringify(response))
                break;
            default:
                console.log('Unknown response');

        }
    });
})