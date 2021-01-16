const lessonServiceInstance = require('../services/LessonService');
const { writeLessonValidation } = require('../utils/validation');
const { ffmpegFunction, ffmpegFunctionPromise } = require('../utils/ffmpeg');

exports.getLessons = async (req, res, next) => {
    try {
        const { category, price, location } = req.query;
        console.log('controllers: getLessons');

        const { status, message } = await lessonServiceInstance.getLessons(category, price, location);
        res.send({ status, message });
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
        const { title, nickname, detail, content, imagePath, videoPath, isProfile } = req.body;
        console.log('controllers: writeLesson', title, nickname, detail, content, imagePath, videoPath, isProfile);

        const { price, category, location } = detail;
        const error = await writeLessonValidation({ title, nickname, content, price, category, location, isProfile });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await lessonServiceInstance.writeLesson(title, nickname, detail, content, isProfile, imagePath, imagePath);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.uploadLessonImage = async (req, res, next) => {
    try {
        console.log(req.file);  // 업로드 정보를 가짐
        // res.send({ message: req.file });    
        // express.static을 통해 실제 파일은 /public/images/lessons에 있지만 요청은 img/lesson으로 한다
        res.json({ status: 200, url: `/api/image/lesson/${req.file.filename}` }); 
    }
    catch(err) {
        next(err);
    }
};

exports.uploadLessonVideo = async (req, res, next) => {
    try {
        console.log(req.file);  // 업로드 정보를 가짐
        const FILENAME = req.file.filename.split('.')[0];
        // res.json({ url: `/video/m3u8/${FILENAME}.m3u8` }); 
        res.send({ status: 200, file: req.file });
        ffmpegFunction(FILENAME, req.file.filename);
    }
    catch(err) {
        next(err);
    }
};

exports.getLessonInfo = async (req, res, next) => {
    try {
        console.log('controllers: getLessonInfo');  
        const { lid } = req.params;
        
        const { status, message } = await lessonServiceInstance.getLessonInfo(lid);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.updateLessonInfo = async (req, res, next) => {
    try {
        const { title, nickname, detail, content, imagePath, videoPath, isProfile } = req.body;
        console.log('controllers: updateLessonInfo', title, nickname, detail, content, imagePath, videoPath, isProfile);  
        const { lid } = req.params;

        const { price, category, location } = detail;
        const error = await writeLessonValidation({ title, nickname, content, price, category, location, isProfile });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });
        
        const { status, message } = await lessonServiceInstance.updateLessonInfo(lid, title, nickname, detail, content, imagePath, videoPath, isProfile);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.deleteLessonInfo = async (req, res, next) => {
    try {
        console.log('controllers: deleteLessonInfo');  
        const { lid } = req.params;
        
        const { status, message } = await lessonServiceInstance.deleteLessonInfo(lid);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};