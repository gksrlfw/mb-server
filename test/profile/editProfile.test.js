const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('UPDATE /user/profile/edit/:uid', () => {
    const agent = request.agent(app);

    test('editprofile: not loggedin user', async (done) => {
        request(app)
        .post('/user/profile/edit/:uid')
        .query({ uid: '1' })
        .expect(403, done)
    });

    beforeEach((done) => {
        agent
        .post('/auth/login')
        .send({
            email: 'gksrlfw@naver',
            password: 'gksrlfw123'
        })
        .end(done);
    });

    test('editprofile: not exist uid', async (done) => {
        agent
        .post('/user/profile/edit/:uid')
        .query({ uid: '0' })
        .expect(403, done)
    });

    /* 문자열 초과 에러 테스트 추가하자 */
    const aboutMe = 'a'.repeat(10000);
    test('editprofile: exceed string', async (done) => {
        agent
        .post('/user/profile/edit/:uid')
        .query({ uid: '1' })
        .send({
            "aboutMe": aboutMe
        })
        .expect(403, done)
    });

    test('editprofile: correct editprofile', async (done) => {
        agent
        .update('/user/profile/edit/:uid')
        .query({ uid: '1' })
        .send({
            "aboutMe": '피아노 13년 공부했습니다',
            "career": "['백수', '피아노 학원 13년']",
            "imagePath": 'testInputImage'
        })
        .expect(200)
        .exprect('Content-Type', /json/)
        .then(res => {
            const { email, nick, aboutMe, career, imagePath } = res.body;
            expect(nick).toEqual('한길이');
            expect(email).toEqual('gksrlfw@naver');
            expect(aboutMe).toEqual('피아노 13년 공부했습니다');
            expect(career).toEqual("['백수', '피아노 학원 13년']");
            expect(imagePath).toEqual('C:\\Users\\gksrl\\Desktop\\mohobby-server\\server\\public\\images\\testInputImage.jpg');
            done();
        })
        .catch(err => {
            console.error(err);
            done(err);
        })
    });
});