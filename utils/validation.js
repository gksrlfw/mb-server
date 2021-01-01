// VALIDATION
const Joi = require('@hapi/joi');

const emailValidation = async (data) => {
    try {
        const schema = Joi.object({
            email: Joi.string().min(2).max(40).required()
        });
        await schema.validateAsync(data);    
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

const joinValidation = async (data) => {
    try {
        const schema = Joi.object({
            email: Joi.string().min(2).max(40).required(),
            nickname: Joi.string().min(2).max(20).required(),
            password: Joi.string().min(8).max(20).required()
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

const loginValidation = async (data) => {
    try {
        const schema = Joi.object({
            email: Joi.string().min(2).max(40).required(),
            password: Joi.string().min(8).max(20).required()
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자열 형식을 지켜주세요!';
        return err.message;
    }
}

const profileValidation = async (data) => {
    try {
        const schema = Joi.object({
            aboutMe: Joi.string().max(200),
            career: Joi.string().max(1000)
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

const passwordValidation = async (data) => {
    try {
        const schema = Joi.object({
            password: Joi.string().min(8).max(20).required(),
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

module.exports = { emailValidation, loginValidation, joinValidation, profileValidation, passwordValidation };