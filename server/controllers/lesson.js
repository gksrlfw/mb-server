const lessonServiceInstance = require('../services/LessonService');
const { writeLessonValidation } = require('../utils/validation');
const { ffmpegFunction, ffmpegFunctionPromise } = require('../utils/ffmpeg');

exports.getLessons = async (req, res, next) => {
    try {
        const { category, price, location } = req.query;
        console.log('controllers: getLessons');

        const { status, message } = await lessonServiceInstance.getLessons(category, price, location);
        res.status(status).send(message);
    }
    catch(err) {
        next(err);
    }
};

/*
    multer로 이미지, 동영상 받을 수 있도록 만들기
    만약 동영상이 들어오면 ffmpeg 실행
*/
exports.writeLesson = async (req, res, next) => {
    try {
        const { nickname, detail, content, imageInfo, videoInfo, isProfile } = req.body;
        console.log('controllers: writeLesson', fileInfo);

        const error = await writeLessonValidation({ aboutMe, career });
        if(typeof error !== 'undefined') return res.status(403).send(error);

        const { status, message } = await lessonServiceInstance.getLessons(nickname, detail, content, isProfile, imageInfo, videoInfo, isProfile);
        res.status(status).send(message);

        await ffmpegFunctionPromise(videoInfo); // ffmpeg 실행
    }
    catch(err) {
        next(err);
    }
};

exports.uploadLessonImage = async (req, res, next) => {
    try {
        console.log(req.file);  // 업로드 정보를 가짐
        res.send({ message: req.file });    
    }
    catch(err) {
        next(err);
    }
};

exports.uploadLessonVideo = async (req, res, next) => {
    try {
        console.log(req.file);  
        res.send({ message: req.file });
    }
    catch(err) {
        next(err);
    }
};