const db = require('../config/db');
const passport = require('passport');

const UserService = require('../services/UserService');
const { emailValidation, loginValidation, joinValidation } = require('../utils/validation');
const { createAccessToken } = require('../utils/jsonwebtoken');

exports.authEmail = async (req, res, next) => {
    try {
        console.log('authEmail: controllers');
        const { email } = req.body;
        const error = await emailValidation({ email });
        if(typeof error !== 'undefined') return res.status(403).send(error);

        const userServiceInstance = new UserService(db);
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

        const userServiceInstance = new UserService(db);
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
        return req.login(user, (pwdError) => {
            if(pwdError) return res.send(pwdError);
            const accessToken = createAccessToken(user.UID);
            return res.status(info.status).header('auth_token', accessToken).send({
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
        console.log('logout: relogin');
        if(req.isAuthenticated()) res.status(200).send(req.user);
        else res.status(500).send('로그인이 풀린상태입니다. 다시 로그인해주세요!');
    }
    catch(err) {
        next(err);
    }
};