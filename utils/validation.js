// VALIDATION
const Joi = require('@hapi/joi');

const emailValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(2).required()
    });
    return schema.validate(data);
}

const registerValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(2).required(),
        nick: Joi.string().min(2).required(),
        password: Joi.string().min(2).required()
    });
    return schema.validate(data);
}

const signinValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(2).required(),
        password: Joi.string().min(2).required()
    });
    return schema.validate(data);
}

const isSignIn = (req, res, next) => {
    // req.user = id, nick
    console.log('isLogin', req.user);
    if(req.user) next();
    else res.status(403).send('로그인 필요');
};

const isNotSignIn = (req, res, next) => {
    console.log('isNotLogin', req.user);

    if(!req.user) next();
    else res.status(403).send('로그인 상태');
};


module.exports = { emailValidation, registerValidation, signinValidation, isSignIn, isNotSignIn };