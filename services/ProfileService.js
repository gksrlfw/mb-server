const db = require('../config/db');
const { encodePassword } = require('../utils/bcrypt');

class ProfileService {

    constructor(db) {
        this.db = db;
    }
    async getUserProfile(uid) {
        try {
            console.log('service: getUserProfile');
            console.log('uid: ', uid);
            let SQL = `SELECT * FROM PROFILES WHERE P_UID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [uid]);
            if(!results.length) return { status: 403, message: '해당하는 유저가 존재하지 않습니다' };
            let result = {};
            result.aboutMe = results[0].ABOUT_ME;
            result.career = results[0].CAREER;
            result.imagePath = results[0].IMAGE_PATH;

            SQL = `SELECT * FROM USERS WHERE UID=?`;
            [results, fields] = await this.db.promise().execute(SQL, [uid]);
            result.email = results[0].EMAIL;
            result.nick = results[0].NICK;
            return { status: 200, message: result };
        }
        catch(err) {
            console.error(err);
        }
    }

    async editUserProfile(uid, aboutMe, career) {
        try {
            console.log('service: editUserProfile');
            let SQL = `SELECT * FROM PROFILES WHERE P_UID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [uid]);
            if(!results.length) return { status: 403, message: '해당하는 유저가 존재하지 않습니다' };

            let result = {};
            SQL = `UPDATE PROFILES SET ABOUT_ME=?, CAREER=? WHERE P_UID=?`;
            if(aboutMe === undefined) aboutMe = '';
            if(career === undefined) career = '';
            await this.db.promise().execute(SQL, [aboutMe, career, uid]);

            SQL = `SELECT * FROM PROFILES;`;
            [results, fields] = await this.db.promise().execute(SQL, [aboutMe, career, uid]);
            result.aboutMe = results[0].ABOUT_ME;
            result.career = results[0].CAREER;
            result.imagePath = results[0].IMAGE_PATH;

            SQL = `SELECT * FROM USERS WHERE UID=?`;
            [results, fields] = await this.db.promise().execute(SQL, [uid]);
            result.email = results[0].EMAIL;
            result.nick = results[0].NICK;

            return { status: 200, message: result };
        }
        catch(err) {
            console.error(err);
        }
    }

    async editUserPassword(uid, password) {
        try {
            console.log('service: editUserPassword');
            let SQL = `SELECT * FROM PROFILES WHERE P_UID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [uid]);
            if(!results.length) return { status: 403, message: '해당하는 유저가 존재하지 않습니다' };

            const hash = encodePassword(password);
            SQL = `UPDATE USERS SET PASSWORD=? WHERE UID=?`;
            await this.db.promise().execute(SQL, [aboutMe, career, uid]);
            return { status: 200, message: 'succeed' };
        }
        catch(err) {
            console.error(err);
        }
    }

    async getMyPage(uid) {
        try {
            console.log('service: getMyPage');
            let SQL = `SELECT * FROM PROFILES WHERE P_UID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [uid]);
            if(!results.length) return { status: 403, message: '해당하는 유저가 존재하지 않습니다' };
            
            let result = {};
            SQL = `SELECT LID, TITLE, COMPLETED, CDAT, UDAT, DDAT FROM LESSONS WHERE L_NICK = (SELECT NICK FROM USERS WHERE UID=?);`;
            [results, fields] = await this.db.promise().execute(SQL, [uid]);
            result.lessons = results[0];
            
            SQL = `SELECT * FROM COMMENTS WHERE C_NICK = (SELECT NICK FROM USERS WHERE UID=?);`;
            [results, fields] = await this.db.promise().execute(SQL, [uid]);
            result.comments = results[0];
            return { status: 200, message: result };
        }
        catch(err) {
            console.error(err);
        }
    }
}

const profileServiceInstance = new ProfileService(db);
module.exports = profileServiceInstance;