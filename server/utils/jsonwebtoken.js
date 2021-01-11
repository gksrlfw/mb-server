const jwt = require('jsonwebtoken');

// 로그인 지속시간은 1시간. 
const createAccessToken = (uid) => {
    try {
        console.log('uidddddddddddddddddd', uid);
        return jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
    catch(err) {
        console.error(err);
    }
    
}

// 프론트쪽에 보낼때는 body에 넣어서, 올때는 header에 넣어서!
const verifyToken = (req, res, next) => {
    // const { token } = req.body;
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // 생각해보니 id를 프론트에서 굳이 받을필요 없이, 토큰을 인증하고 나온 req.user로 진행해도 될 것 같다.. 
        req.user = { UID: verified._id };
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