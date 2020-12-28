const passport = require('passport');
const db = require('../config/db');
const local = require('./passportLocal');


module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser', user.UID);
        done(null, user.UID);
    });
    // db 접근하는게 마음에 안드네.. 나중에 해보기..
    passport.deserializeUser(async (id, done) => {
        try {
            console.log('deserializeUser');
            const SQL = `SELECT UID, NICK FROM USERS WHERE UID=?`
            const [results, fields] = await db.promise().execute(SQL, [id]);
            const user = results[0];
            done(null, user);
        }
        catch(err) {
            console.error(err);
            done(err);
        }
    });
    local();
}