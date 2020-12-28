const { encodePassword, decodePassword } = require('../utils/bcrypt');
const { sendAuthEmail } = require('../utils/nodemailer');
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

    async join(email, password, nick) {
        try {
            console.log('join: service', email, password, nick);
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
            if(!results.length) return { status: 404, message: '회원가입' };
            const result = await decodePassword(password, results[0].PASSWORD);
            if(result) return { status: 200, message: results[0] };
            return { status: 400, message: '비밀번호' };
        }
        catch(err) {
            console.error(err);
        }
    }
}

module.exports = UserService;