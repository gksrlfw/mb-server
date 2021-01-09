const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('GET /user/mypage/:uid', () => {
    test('getmypage: not login user', async (done) => {
        request(app)
        .get('/user/profile/1')
        .expect(403, done);
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

    test('getmypage: not exist uid', async (done) => {
        request(app)
        .get('/user/mypage/1')
        .expect(403, done)
    });

    test('getmypage: correct getmypage:', async (done) => {
        agent
        .get('/user/mypage/1')
        .expect(200, done);
        // result: comment list, lesson list -> 귀찮..
    });
});