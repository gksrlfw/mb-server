const db = require('../config/db');
const passport = require('passport');

const userServiceInstance = require('../services/UserService');
const { emailValidation, nicknameValidation, loginValidation, joinValidation } = require('../utils/validation');
const { createAccessToken } = require('../utils/jsonwebtoken');

exports.authEmail = async (req, res, next) => {
    try {
        console.log('authEmail: controllers');
        const { email } = req.body;
        const error = await emailValidation({ email });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await userServiceInstance.authEmail(email);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.authNickname = async (req, res, next) => {
    try {
        console.log('authNickname: controllers');
        const { nickname } = req.body;
        const error = await nicknameValidation({ nickname });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await userServiceInstance.authNickname(nickname);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.join = async (req, res, next) => {
    try {
        console.log('join: controllers');
        const { email, password, nickname } = req.body;
        const error = await joinValidation({ email, password, nickname });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });

        const { status, message } = await userServiceInstance.join(email, password, nickname);
        res.send({ status, message });
    }
    catch(err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        console.log('login: controllers');
        const { email, password } = req.body;
        const error = await loginValidation({ email, password });
        if(typeof error !== 'undefined') return res.send({ status: 403, message: error });
        passport.authenticate('local', (authError, user, info) => {
            if(authError) {
                console.error("error: ",authError);
                return res.send({ status: info.status, message: info.message });
            }
            if(!user) return res.send({ status: info.status, message: info.message });
            return req.login(user, (pwdError) => {
                if(pwdError) return res.send(pwdError);                
                const accessToken = createAccessToken(user.UID);
                return res.send({
                    status: info.status, 
                    token: accessToken,
                    nick: user.NICK,
                    email: user.EMAIL,
                    id: user.UID 
                });
            });
        })(req, res, next);
    }
    catch(err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        console.log('logout: controllers');
        req.logout();           
        req.session.destroy();  
        res.send({ status: 200, message: 'succeed' });
    }
    catch(err) {
        next(err);
    }
};

exports.relogin = async (req, res, next) => {
    try {
        console.log('logout: relogin', req.isAuthenticated());
        if(req.isAuthenticated()) res.send({ status: 200, message: req.user });
        else res.status(500).send({ status: 500, message: '서버가 재실행되어 다시 로그인해야합니다!' });
    }
    catch(err) {
        next(err);
    }
};