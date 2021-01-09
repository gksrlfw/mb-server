const fs = require('fs');
const hls = require('hls-server');

const app = require('./server');

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if (err) {
                    console.log('File not exist');
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
});

// const ffmpegFunctoin = require('./ffmpeg');

// app.get('/', (req, res) => {
//     // ffmpegFunctoin(() => {
//     //     return res.status(200).sendFile(`${__dirname}/client.html`);
//     // })
//     ffmpegFunctoin();
//     return res.status(200).sendFile(`${__dirname}/client.html`);
// });