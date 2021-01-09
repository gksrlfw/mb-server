const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

describe('UPDATE /user/profile/editpw/:uid', () => {
    const agent = request.agent(app);

    test('editpassword: not loggedin user', async (done) => {
        request(app)
        .put('/user/profile/editpw/1')
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

    test('editpassword: not exist uid', async (done) => {
        agent
        .put('/user/profile/editpw/0')
        .expect(403, done)
    });

    let password = 'a'.repeat(25);
    test('editpassword: exceed string', async (done) => {
        agent
        .put('/user/profile/editpw/1')
        .send({
            password: password
        })
        .expect(403, done)
    });

    password = 'a'.repeat(5);
    test('editpassword: less string', async (done) => {
        agent
        .put('/user/profile/editpw/1')
        .send({
            password: password
        })
        .expect(403, done)
    });

    test('editpassword: correct editpassword', async (done) => {
        agent
        .put('/user/profile/editpw/1')
        .send({
            password: "gksrlfw1234"
        })
        .expect(200, done)  // redirect: main
    });
});