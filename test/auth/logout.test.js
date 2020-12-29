const request = require('supertest');
const app = require('../../server/server');
const { createAll, deleteAll } = require('../../server/config/table_test');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

// agent로 상태를 유지할 수 있다
describe('POST /auth/logout', () => {
    test('logout: Not login status', async (done) => {
        request(app)
        .get('/auth/logout')
        .expect(403, done)
    });
    
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

    test('logout: login status', async (done) => {
        agent
        .get('/auth/logout')
        .expect(200, done)
    });
});
