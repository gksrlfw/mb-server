const isLogin = (req, res, next) => {
    // req.user = id, nick
    console.log('authMiddleware: isLogin', req.user);
    if(req.user) next();
    else res.status(403).send('로그인 필요');
};

const isNotLogin = (req, res, next) => {
    console.log('authMiddleware: isNotLogin', req.user);
    if(!req.user) next();
    else res.status(403).send('로그인 상태');
};

module.exports = { isLogin, isNotLogin };