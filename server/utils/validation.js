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

const nicknameValidation = async (data) => {
    try {
        const schema = Joi.object({
            nickname: Joi.string().min(2).max(20).required()
        });
        await schema.validateAsync(data);    
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요! (2 ~ 20 자리로 입력해주세요)';
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

const lessonFilterValidation = async (data) => {
    try {
        const schema = Joi.object({
            category: Joi.string().min(8).max(20).required(),
            price: Joi.string().min(8).max(20).required(),
            location: Joi.string().min(8).max(20).required()
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

const writeLessonValidation = async (data) => {
    try {
        // required가 맞는가??...
        const schema = Joi.object({
            title: Joi.string().min(2).max(100).required(),
            nickname: Joi.string().min(2).max(20).required(),
            price: Joi.string().required(),
            category: Joi.string().required(),
            location: Joi.string().required(),
            content: Joi.required(),
            isProfile: Joi.boolean().required(),
        });
        await schema.validateAsync(data);
    }
    catch(err) {
        console.error(err);
        err.message = '입력 문자 형식을 지켜주세요!';
        return err.message;
    }
}

module.exports = { emailValidation, nicknameValidation, loginValidation, joinValidation, profileValidation, passwordValidation, lessonFilterValidation,
    writeLessonValidation };