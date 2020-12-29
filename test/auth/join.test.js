const request = require('supertest');
const app = require('../../server/server');         // 얘가 db_test가 아닌 db를 써서 계속 안됨 ,,,
const { createAll, deleteAll } = require('../../server/config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('POST /auth/join', () => {
    test('join: duplicated email', async (done) => {
        request(app)
        .post('/auth/join')
        .send({
            "email": "gksrlfw@naver",
            "password": "gksrlfw123",
            "nickname": "한길이"
        })
        .expect(403, done)
    });

    test('join: right join', async (done) => {
        request(app)
        .post('/auth/join')
        .send({
            "email": "enrlfw@naver",
            "password": "enrlfw123",
            "nickname": "두길이"
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body.message).toEqual('succeed');
            done();
        })
        .catch(err => {
            console.error(err);
            done(err);
        })
    });
});