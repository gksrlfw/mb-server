//  로그인을 어떻게 할 지 전략

const passport = require('passport');
const db = require('../config/db');
const LocalStrategy = require('passport-local').Strategy;
const userServiceInstance = require('../services/UserService');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            console.log('passportLocal');
            const { status, message } = await userServiceInstance.login(email, password);
            console.log(status, message);
            if(status === 404) done(null, false, { status, message });
            if(status === 400) done(null, false, { status, message });
            // if(status === 500) done(message);
            if(status === 200) done(null, message, { status, message: 'succeed' }); // message: exUser
        }
        catch(err) {
            console.error(err);
            done('로그인 실패');
        }
    }));
}