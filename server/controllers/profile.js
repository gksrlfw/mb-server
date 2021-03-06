const profileServiceInstance = require('../services/ProfileService');
const userServiceInstance = require('../services/UserService');
const { profileValidation, passwordValidation } = require('../utils/validation');
/* 항상 로그인 상태 */

exports.getUserProfile = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { status, message } = await profileServiceInstance.getUserProfile(uid);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

// image를 받아야 한다 -> 
exports.editUserProfile = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { aboutMe, career, imageInfo } = req.body;

        const error = await profileValidation({ aboutMe, career });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await profileServiceInstance.editUserProfile(uid, aboutMe, career, imageInfo);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.editUserPassword = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { password } = req.body;

        const error = await passwordValidation({ password });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await userServiceInstance.editUserPassword(uid, password);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.getMyPage = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { status, message } = await profileServiceInstance.getMyPage(uid);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.uploadProfileImage = async (req, res, next) => {
    try {
        console.log(req.file);  // 업로드 정보를 가짐
        // res.send({ message: req.file });
        res.json({ status: 200, url: `/api/image/profile/${req.file.filename}` });
    }
    catch(err) {
        next(err);
    }
};