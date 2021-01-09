const { encodePassword, decodePassword } = require('../utils/bcrypt');
const { sendAuthEmail } = require('../utils/nodemailer');
const db = require('../config/db');

class UserService {
    db;
    constructor(db) {
        this.db = db;
    }

    async authEmail(email) {
        try {
            console.log('authEmail: service');
            const SQL = `SELECT * FROM USERS WHERE EMAIL=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [email]);
            if(results.length) return { status: 403, message: '이미 가입되어있는 이메일입니다. 다른 이메일로 시도해주세요' };
            /* 이메일 인증 */
            const message = await sendAuthEmail(email);
            if(typeof message === 'object') return { status: 403, message: message.message };
            return { status: 200, message };
        }
        catch(err) {
            console.error(err);
        }
    }
    /* authMail을 안했으면 이게 안되게 해줘야하는데... 디비에서 검사하는거 이외에 방법을 모르겠다. 프론트에서 해결해달라고 하자.. */
    async join(email, password, nick) {
        try {
            console.log('join: service', email, password, nick);
            // 위에서 확인했지만 한번더 해주자
            const _SQL = `SELECT * FROM USERS WHERE EMAIL=?`;
            let [results, fields] = await this.db.promise().execute(_SQL, [email]);
            if(results.length) return { status: 403, message: '이미 가입되어있는 이메일입니다. 다른 이메일로 시도해주세요' }

            const SQL = `INSERT INTO USERS(EMAIL, PASSWORD, NICK) VALUES(?,?,?)`;
            const hash = await encodePassword(password);
            await this.db.promise().execute(SQL, [email, hash, nick]);
            return { status: 200, message: 'succeed' };
        }
        catch(err) {
            console.error(err);
        }
    }

    async login(email, password) {
        try {
            console.log('login: service');
            const SQL = `SELECT * FROM USERS WHERE EMAIL=?`;
            const [results, fields] = await this.db.promise().execute(SQL, [email]);
            if(!results.length) return { status: 404, message: '회원가입이 되어있지 않습니다!' };
            const result = await decodePassword(password, results[0].PASSWORD);
            if(result) return { status: 200, message: results[0] };
            return { status: 400, message: '비밀번호가 틀렸습니다!' };
        }
        catch(err) {
            console.error(err);
        }
    }
    
    async editUserPassword(uid, password) {
        try {
            console.log('editUserPassword: service');
            let SQL = `SELECT * FROM USERS WHERE UID=?`;
            const [results, fields] = await this.db.promise().execute(SQL, [uid]);
            if(!results.length) return { status: 404, message: '존재하지 않은 회원입니다!' };

            SQL = `UPDATE USERS SET PASSWORD=? WHERE UID=?`;
            const hash = await encodePassword(password);
            await this.db.promise().execute(SQL, [uid, password]);
            return { status: 200, message: 'succeed' };
        }
        catch(err) {
            console.error(err);
        }
    }
}

const userServiceInstance = new UserService(db);
module.exports = userServiceInstance;