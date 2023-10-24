const express = require('express')
const app = express();
const fs = require('fs')
const port = 3000;

// start capture
const videoStream = require('./videoStream');
videoStream.startVideoStream({
        width: 1920,
        height: 1080,
        fps: 24,
        encoding: 'JPEG',
        quality: 25 // lower is faster, less quality
    }, 
    '/stream.mjpg', true);

app.use(express.static(__dirname+'/public'));
app.listen(port, () => console.log(`Example app listening on port ${port}! In your web browser, navigate to http://<IP_ADDRESS_OF_THIS_SERVER>:3000`));
