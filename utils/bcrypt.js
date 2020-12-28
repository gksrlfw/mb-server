
const Bcrypt = require('bcrypt');

const encodePassword = async (password) => {
    try {
        return await Bcrypt.hash(password, 10);
    }
    catch(err) {
        console.error(err);
    }
}

const decodePassword = async (inputPassword, hash) => {
    try {
        const result = await Bcrypt.compare(inputPassword, hash);
        return result;
    }
    catch(err) {
        console.error(err);
    }    
}

module.exports = { encodePassword, decodePassword };