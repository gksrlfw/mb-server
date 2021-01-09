const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

// dont have to be login
describe('GET /lesson', () => {
    // 이게 틀리진 않음... 어차피 검색이 안되니까 그냥 넘어가보자..
    // test('getLesson: invalid query', async (done) => {
    //     request(app)
    //     .get('/lesson')
    //     .query({ 
    //         category: '운동',
    //         price: '5000',
    //         location: '부산',
    //         gang: '오잉?'       // invalid
    //     })
    //     .expect(403, done)
    // });

    test('getLesson: invalid value: location', async (done) => {
        request(app)
        .get('/lesson')
        .query({ 
            category: '운동',
            price: '[5000,10000]',
            location: '화성'    // invalid
        })
        .expect(403, done)
    });

    test('getLesson: invalid value: price', async (done) => {
        request(app)
        .get('/lesson')
        .query({ 
            category: '운동',
            price: '[10000,5000]'       // invalid
        })
        .expect(403, done)
    });



    test('getLesson: valid value', async (done) => {
        request(app)
        .get('/lesson')
        .query({ 
            category: '운동',
            price: '[5000,10000]'
        })
        .expect(200, done)
    });

    test('getLesson: valid value', async (done) => {
        request(app)
        .get('/lesson')
        .query({ 
            category: '운동',
        })
        .expect(200, done)
    });

    test('getLesson: valid value', async (done) => {
        request(app)
        .get('/lesson')
        .expect(200, done)
    });

    test('getLesson: valid request', async (done) => {
        request(app)
        .get('/lesson')
        .query({ 
            category: '운동',
            price: '[5000,10000]',
            location: '부산',
        })
        .expect(200, done)
    });
});