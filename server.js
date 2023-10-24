const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const overlay = require('./overlay.js');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let cameraWs = [];
let clientsWs = [];

let videoObject = {
  get lastFrame() {
    return this._lastFrame;
  },
  set lastFrame(value) {
    myEmitter.emit('frameChanged', value);
    this._lastFrame = value;
  },
  
}

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


//On first connection register the socket to its respective array
wss.on('connection', (ws) => { //remember to convert the message with .toStr

    ws.on('message', (message) => {
      message = message.toString();
      if(message == "cameraWs"){
        cameraWs.push(ws);
        console.log("cameraWs connected");
        ws.removeAllListeners('message');
        RefreshCameras();
        return;
      }
      else if (message == "clientWs"){
        clientsWs.push(ws);
        console.log("clientsWs connected");
        ws.removeAllListeners('message');
        return;
      }
    });
});



function RefreshCameras(){
  cameraWs.forEach((ws) => {
    ws.on('message', (message) => {
      //console.log("message to camera object recieved");
      videoObject.lastFrame = message;
      
    });
  });
}

myEmitter.on('frameChanged', (frame) => {
  clientsWs.forEach((ws) => {
    ws.send(videoObject.lastFrame);
    
  });
});




server.listen(3000, () => {
  console.log('Server is running on port 3000.');
});




