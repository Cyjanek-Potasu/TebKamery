const ffmpeg = require('fluent-ffmpeg');
const { spawn } = require('child_process');

module.exports = (blobl) => {
    
    let bloblout;
    const inputStream = require('stream').Readable.from(blobl);
    let currentTime = new Date().toLocaleString();
    const ffmpegProcess = spawn('ffmpeg', [
        // Specify the input format as raw image data
        '-f', 'image2pipe',
        '-i', 'pipe:0', // Input from stdin (pipe)
        '-vf', `drawtext=text='${currentTime}':x=10:y=10:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5`,
        blobl,
      ]);

    ffmpegProcess.stdin.write(blobl);
    ffmpegProcess.stdin.end();

    ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          return blobl;
        } else 
        {
          console.error('Error applying layout:', code);
        }
      });

}


    
