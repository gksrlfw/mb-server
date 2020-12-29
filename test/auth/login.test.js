const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('POST /auth/login', () => {
    test('login: invalidate input', async (done) => {
        request(app)
        .post('/auth/login')
        .send({
            "email": 'gksrlfw@naver',
            "password": 'b'
        })
        .expect(403, done)
    });

    test('login: right request', async (done) => {
        request(app)
        .post('/auth/login')
        .send({
            "email": 'gksrlfw@naver',
            "password": 'gksrlfw123'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            const { nick, email, id } = res.body;
            expect(nick).toEqual('한길이');
            expect(email).toEqual('gksrlfw@naver');
            expect(id).toEqual(1);
            done();
        })
        .catch(err => {
            console.error(err);
            done(err);
        })
    });
});

describe('POST /auth/login', () => {
    const agent = request.agent(app);
    // 테스트 직전에 실행
    beforeEach((done) => {
        agent
        .post('/auth/login')
        .send({
            email: 'gksrlfw@naver',
            password: 'gksrlfw123'
        })
        .end(done);
    });
    test('login: current status is login', async (done) => {
        agent
        .post('/auth/login')
        .send({
            "email": 'gksrlfw@naver',
            "password": 'gksrlfw123'
        })
        .expect(403, done)
    });
});
