const lessonServiceInstance = require('../services/LessonService');
const { lessonFilterValidation } = require('../utils/validation');

exports.getLessons = async (req, res, next) => {
    try {
        const { category, price, location } = req.query;
        // console.log({ category, price, location });
        console.log('controllers: getLessons');

        // 생각해보니까 딱히 필요없는듯.. 어차피 디비에 없으면 팅기니까..
        // const error = await profileValidation({ category, price, location });
        // if(typeof error !== 'undefined') return res.status(403).send(error);

        const { status, message } = await lessonServiceInstance.getLessons(category, price, location);
        res.status(status).send(message);
    }
    catch(err) {
        next(err);
    }
};
