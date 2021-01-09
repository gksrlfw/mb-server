const db = require('../config/db');

exports.test = async (req, res, next) => {
    try {
        console.log(req.user);
        res.send({ message: 'absc!!!!AA' });
    }
    catch(err) {
        console.error(err);
    }
};

exports.testDB = async (req, res, next) => {
    try {
        console.log('testDB...');
        const [results, fields] = await db.promise().execute('select * from users');
        console.log(results);
        res.send(`find User: ${results}`);
    }
    catch(err) {
        next(err);
    }
};

exports.testpost = async (req, res) => {
    try {
        const result = await Post.create({ title: 'aa', content: '비비' });
        console.log(result);
        res.send(`create post: ${result}`);
    }
    catch(err) {
        console.error(err);
    }
};

exports.testpost2 = async (req, res) => {
    try {
        const result = await Post.findOne({ where: { title: 'aa' }});
        console.log(result.content);
        res.send(`find post: ${result.content}`);
    }
    catch(err) {
        console.error(err);
    }
};