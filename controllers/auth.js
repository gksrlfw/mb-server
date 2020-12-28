
const db = require('../config/db');
const UserService = require('../services/UserService');
const passport = require('passport');
const { emailValidation, registerValidation } = require('../utils/validation');

/* 데이터를 받았을 때, validation 하는 방법을 생각해보자... 타입이나, 글자수나... */
exports.authEmail = async (req, res, next) => {
    try {
        console.log('authEmail: controllers');
        const { email } = req.body;
        emailValidation(email);
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
        registerValidation(email, password, nickname);
        const userServiceInstance = new UserService(db);
        const { status, message } = await userServiceInstance.join(email, password, nickname);
        res.status(status).send({ code: message });
    }
    catch(err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error("error: ",authError);
            return res.status(info.status).send(info.message);    
        }
        if(!user) return res.status(info.status).send(info.message);
        return req.login(user, (pwdError) => {
            if(pwdError) return res.send(pwdError);
            return res.status(info.status).send({   
                email: user.dataValues.email,
                nick: user.dataValues.nick,
                id: user.dataValues.id
            });
        });
    })(req, res, next);
    console.log('asdf');
};

