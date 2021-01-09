const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

const ffmpegFunction = (title) => {
    try {
        const FILENAME = title.split('.')[0];
        const INPUT_PATH = path.join(__dirname, '..', 'public/videos', title);
        const OUTPUT_PATH = path.join(__dirname, '..', 'public/videos', `${FILENAME}.m3u8`);
        console.log(title, FILENAME);
        ffmpeg.setFfmpegPath(ffmpegInstaller.path);
        ffmpeg(INPUT_PATH, { timeout: 432000 }).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 60',
            '-hls_list_size 0',
            '-f hls'
        ]).output(OUTPUT_PATH).on('end', (err, stderr) => {
            if(err) console.error(err);
            console.log('end', stderr);
        }).run();
    }
    catch(err) {
        console.error(err);
    }
}

const ffmpegFunctionPromise = (fileInfo) => {
    return new Promise((res, rej) => {
        const FILENAME = fileInfo.filename.split('.')[0];
        const INPUT_PATH = path.join(__dirname, '..', 'public/videos/lessons', fileInfo.filename);
        const OUTPUT_PATH = path.join(__dirname, '..', 'public/videos/m3u8', `${FILENAME}.m3u8`);
        ffmpeg.setFfmpegPath(ffmpegInstaller.path);
        ffmpeg(INPUT_PATH, { timeout: 432000 }).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 60',
            '-hls_list_size 0',
            '-f hls'
        ]).output(OUTPUT_PATH).on('end', (err, stderr) => {
            if(err) console.error(err);
            console.log('end', stderr);
            res('success');
        }).run();
    })
    .catch(err => {
        console.error(err);
    })
}

module.exports = { ffmpegFunction, ffmpegFunctionPromise };