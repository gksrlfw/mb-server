const request = require('supertest');
const app = require('../../server');        
const { createAll, deleteAll } = require('../../config/table');

beforeAll(async () => {
    await deleteAll();
    await createAll();
});

// must be login
describe('POST /lesson/write', () => {
    const agent = request.agent(app);

    test('writeLesson: not loggedin user', async (done) => {
        request(app)
        .post('/lesson/write')
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

    test('writeLesson: successful request', async (done) => {
        agent
        .post('/lesson/write')
        .send({
            title: '게시글1',
            nickname: '한길이',
            detail: {
                category: '운동',
                location: '부산',
                price: '9000'
            },
            content: '주 1회 PT',
            isProfile: true
        })
        .expect(200)
        .then(res => {
            const { title, nickname, detail, content, aboutMe, career, imagePathForProfile, imagePathForLesson, videoPathForLesson } = res.body;
            expect(title).toEqual('게시글1');
            expect(nickname).toEqual('한길이');
            expect(detail).toEqual({ category: '운동', location: '부산', price: '9000' });
            expect(content).toEqual("주 1회 PT");
            expect(aboutMe).toEqual('제 이름은 서한길입니다');
            expect(career).toEqual("['신입 준비 중', '여고유치원 졸업']");
            expect(imagePathForProfile).toEqual('C:\\Users\\gksrl\\Desktop\\mohobby-server\\server\\public\\images\\testOutputImage');
            expect(imagePathForLesson).toEqual('');
            expect(videoPathForLesson).toEqual('');
            done();
        })
        .catch(err => {
            console.error(err);
            done(err);
        })
    });

    /* 실패?? */
});