const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

const PATH = path.join(__dirname, '..', 'public/videos');

const ffmpegFunctoin = () => {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg(PATH, { timeout: 432000 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
    ]).output(PATH).on('end', (err, stderr) => {
        if(err) console.error(err);
        console.log('end', stderr);
    }).run();
}

module.exports = ffmpegFunctoin;