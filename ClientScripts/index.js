const fs = require('fs')
const port = 3000;

// start capture
const videoStream = require('./videoStream');
videoStream.startVideoStream({
        width: 2592,
        height: 1944,
        fps: 10,
        encoding: 'JPEG',
        quality: 10 // lower is faster, less quality
    }, 
    '/stream.mjpg', true);

