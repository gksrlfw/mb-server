const nodemailer = require('nodemailer');

const getRandomCode = () => {
    // 6자리 난수 발생
    let code = Math.floor(Math.random() * 1000000)+100000;
    if(code > 1000000) code = code - 100000;
    return code;
}

const sendAuthEmail = async (email) => {
    try {
        console.log('utils: sendAuthEmail');        
        const code = getRandomCode();
        const mailConfig = {
            service: 'Naver',
            host: 'smtp.naver.com',
            port: 587,
            auth: {
              user: process.env.MAIL_EMAIL,
              pass: process.env.MAIL_PASSWORD
            }
        };
        let message = {
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: 'Mohobby 이메일 인증 요청 메일입니다.',
            html: 
                `
                <br>아래 코드를 확인하여 입력해주세요</br>
                <p> ${code} </p>
                `
        };
        let transporter = nodemailer.createTransport(mailConfig);
        await transporter.sendMail(message);
        return code;
    } 
    catch (error) {
        // 여기서 에러가 발생하고 함수가 종료되면 catch구문으로 가는게 아니라 그대로 try 구문에서 그자리로 간다
        console.error(error);
        error.message = '해당 이메일이 존재하지 않습니다';
        return error;
    }
}
module.exports = { sendAuthEmail };