const db = require('../config/db');
const passport = require('passport');

const userServiceInstance = require('../services/UserService');
const { emailValidation, loginValidation, joinValidation } = require('../utils/validation');
const { createAccessToken } = require('../utils/jsonwebtoken');

exports.authEmail = async (req, res, next) => {
    try {
        console.log('authEmail: controllers');
        const { email } = req.body;
        const error = await emailValidation({ email });
        if(typeof error !== 'undefined') return res.status(403).send(error);

        const { status, message } = await userServiceInstance.authEmail(email);
        res.status(status).send({ message });
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
        if(typeof error !== 'undefined') return res.status(403).send(error);

        const { status, message } = await userServiceInstance.join(email, password, nickname);
        res.status(status).send({ message });
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
        if(typeof error !== 'undefined') return res.status(403).send(error);
    }
    catch(err) {
        next(err);
    }
    
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error("error: ",authError);
            return res.status(info.status).send(info.message);    
        }
        if(!user) return res.status(info.status).send(info.message);
        console.log("--000000", info);
        return req.login(user, (pwdError) => {
            console.log("1111111", accessToken, user);
            if(pwdError) return res.send(pwdError);
            const accessToken = createAccessToken(user.UID);
            // return res.status(info.status).header('auth_token', accessToken).send({
            //    nick: user.NICK,
            //    email: user.EMAIL,
            //    id: user.UID 
            // });
            console.log("222222", accessToken, user);
            return res.status(info.status).send({
                token: accessToken,
                nick: user.NICK,
                email: user.EMAIL,
                id: user.UID 
            });
            
        });
    })(req, res, next);
};

exports.logout = async (req, res, next) => {
    try {
        console.log('logout: controllers');
        req.logout();           
        req.session.destroy();  
        res.send('succeed');
    }
    catch(err) {
        next(err);
    }
};

exports.relogin = async (req, res, next) => {
    try {
        console.log('logout: relogin', req.isAuthenticated());
        if(req.isAuthenticated()) res.status(200).send(req.user);
        else res.status(500).send('서버가 재실행되어 다시 로그인해야합니다!');
    }
    catch(err) {
        next(err);
    }
};