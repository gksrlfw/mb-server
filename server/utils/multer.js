// profile, lessons에서 이미지, 동영상 받아야함
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ffmpegFunctoin = require('./ffmpeg');
const { checkDir } = require('./fs');

// https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83

checkDir('/public/images');
checkDir('/public/videos');
checkDir('/public/images/profiles');
checkDir('/public/images/lessons');
checkDir('/public/videos/lessons');
checkDir('/public/videos/m3u8');


const uploadProfileImageM = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'public/images/profiles/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); 
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5*1024*1024 }
});

const uploadLessonImageM = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'public/images/lessons/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); 
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5*1024*1024 }
});

const uploadLessonVideoM = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'public/videos/lessons/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); 
            const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
            done(null, fileName);
        }
    }),
});

module.exports = { uploadProfileImageM, uploadLessonImageM, uploadLessonVideoM };