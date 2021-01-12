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
        console.log('controllers: writeLesson');

        // const error = await writeLessonValidation({ aboutMe, career });
        // if(typeof error !== 'undefined') return res.status(403).send(error);

        const { status, message } = await lessonServiceInstance.writeLesson(nickname, detail, content, isProfile, imageInfo, videoInfo, z);
        res.status(status).send(message);
        // res.status(200).send('hello');
        
        // await ffmpegFunctionPromise(videoInfo); // ffmpeg 실행
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
        res.json({ url: `/image/lesson/${req.file.filename}` }); 
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
        res.send(req.file);
        ffmpegFunction(FILENAME, req.file.filename);
    }
    catch(err) {
        next(err);
    }
};
