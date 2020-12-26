const User = require('../models/user');
const Post = require('../models/post');

exports.test = async (req, res) => {
    try {
        res.send({ message: 'test!' });
    }
    catch(err) {
        console.error(err);
    }
};

exports.testDB = async (req, res) => {
    try {
        const result = await User.findOne({ where: { email: 'gksrlfw@naver.com' }});
        console.log(result.email);
        res.send(`find User: ${result.email}`);
    }
    catch(err) {
        console.error(err);
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