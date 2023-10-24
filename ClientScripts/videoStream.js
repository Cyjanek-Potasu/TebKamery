const WebSocket = require('ws');
const raspberryPiCamera = require('raspberry-pi-camera-native');

let lastFrameObj = {
    lastFrame: null
};

let videoStream = {
    getLastFrame: () => {
        return lastFrameObj.lastFrame;
    },
    startVideoStream: function (cameraOptions, isVerbose) {
        // Start capture
        raspberryPiCamera.start(cameraOptions);
        if (isVerbose) {
            console.log('Camera started.');
        }

        // Create a WebSocket client and connect to the remote server
        const ws = new WebSocket("ws://192.168.1.11:3000");

        // WebSocket open event handler
        ws.on('open', () => {
            if (isVerbose) {
                console.log('WebSocket connected to remote server.');
            }

            // Frame handler function
            let frameHandler = (frameData) => {
                try {
                    ws.send(frameData);
                } catch (ex) {
                    if (isVerbose) {
                        console.log('Unable to send frame over WebSocket: ' + ex);
                    }
                }
            };

            // Add frame data event listener
            let frameEmitter = raspberryPiCamera.on('frame', frameHandler);

            // WebSocket close event handler
            ws.on('close', () => {
                frameEmitter.removeListener('frame', frameHandler);
                if (isVerbose) {
                    console.log('WebSocket connection to remote server closed.');
                }
            });
        });
    }
};

module.exports = videoStream;
