const WebSocket = require('ws');
const raspberryPiCamera = require('raspberry-pi-camera-native');

let lastFrameObj = {
    lastFrame: null
};
let cameraOptions = {
    width: 2592,
    height: 1944,
    fps: 10,
    encoding: 'JPEG',
    quality: 10 // lower is faster, less quality
}

let ws = new WebSocket("ws://192.168.1.11:3000")

let videoStream = {
    getStatus: () => {
        //return the status of the web socket
        if(ws.readyState == WebSocket.OPEN){
            return true
        }
        else{
            return false
        }
    },
    getLastFrame: () => {
        return lastFrameObj.lastFrame;
    },
    startVideoStream: function (cameraOptions) {
        try {
            raspberryPiCamera.start(cameraOptions);
            // Start capture
        


        // Create a WebSocket client and connect to the remote server
        

        // WebSocket open event handler
        ws.on('open', () => {

            ws.send("cameraWs");

            
            // Frame handler function
            let frameHandler = (frameData) => {
                try {
                    ws.send(frameData);
               
                } catch (ex) {
                    console.log(ex);
                }
            };

            // Add frame data event listener
            let frameEmitter = raspberryPiCamera.on('frame', frameHandler);

            // WebSocket close event handler
            ws.on('close', () => {
                frameEmitter.removeListener('frame', frameHandler);

                reconnect(); //----------> tries to reconnect through the websocket
            });
        });
        } catch (er) {
            
            throw new Error();

        }

    }
};

// Reconnect function that checks the websocket status and tries to reconnect every 5 seconds
function reconnect() {
    if (ws.readyState == WebSocket.CLOSED || ws.readyState == WebSocket.CLOSING) {
        // Create a new websocket object with the same url and options
        ws = new WebSocket("ws://192.168.1.11:3000", {protocolVersion: 8, origin: 'http://websocket.org'});
        // Call the startVideoStream function again to attach the event listeners
        try {
            videoStream.startVideoStream(cameraOptions);
        } catch (er) {
            console.log("Failing to Connect to Master Server")
        }

        
    }
    // Call the reconnect function again after 5 seconds
    setTimeout(reconnect, 3000);
}
videoStream.startVideoStream();

