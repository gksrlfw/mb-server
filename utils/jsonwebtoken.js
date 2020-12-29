const jwt = require('jsonwebtoken');

const createAccessToken = (uid) => {
    return jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    console.log(req.header('auth-token'), req.header('Authorization'));
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log('first', req.user);
        // next가 없으면 그 다음 미들웨어가 실행안됨
        next();     
    }
    catch(err) {
        if(err.name === 'TokenExpiredError') {
            return res.status(419).send('expired token');
        }
        res.status(400).send('invalid token');
    }
}

module.exports = { verifyToken, createAccessToken };