const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('GET /user/getprofile', () => {
    test('getprofile: not login user', async (done) => {
        request(app)
        .get('/user/profile/1')
        .expect(403)
        .then(res => {
            console.log('찍어보기!: ', res.body.message);
            done();
        })
        
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
        .post('/auth/login')
        .send({
            email: 'gksrlfw@naver',
            password: 'gksrlfw123'
        })
        .end(done);
    });

    test('getprofile: not exist uid', async (done) => {
        request(app)
        .get('/user/profile/0')
        .expect(403, done)
    });

    test('getprofile: correct getprofile', async (done) => {
        agent
        .get('/user/profile/1')
        .expect(200)
        // .expect('Content-Type', /json/)
        .then(res => {
            const { email, nick, aboutMe, career, imagePath } = res.body;
            expect(nick).toEqual('한길이');
            expect(email).toEqual('gksrlfw@naver');
            expect(aboutMe).toEqual('제 이름은 서한길입니다');
            expect(career).toEqual("['신입 준비 중', '여고유치원 졸업']");
            expect(imagePath).toEqual('C:\\Users\\gksrl\\Desktop\\mohobby-server\\server\\public\\images\\testOutputImage');
            done();
        })
        .catch(err => {
            console.error(err);
            done(err);
        })
    });
});