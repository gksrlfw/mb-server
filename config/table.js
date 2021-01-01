/*
    테이블 생성 및 삭제
*/
const path = require('path');
const db = require('./db');
const { encodePassword } = require('../utils/bcrypt');

const DELETE_COMMENTS = `DROP TABLE COMMENTS;`;
const DELETE_LESSONS = `DROP TABLE LESSONS;`;
const DELETE_PROFILES = `DROP TABLE PROFILES;`;
const DELETE_USERS = `DROP TABLE USERS;`;
const DELETE_CATEGORY = `DROP TABLE CATEGORY;`;
const DELETE_LOCATIONS = `DROP TABLE LOCATIONS;`;

const CREATE_USERS = `
CREATE TABLE USERS (
    UID INT(10) NOT NULL AUTO_INCREMENT,
    EMAIL VARCHAR(100),
    PASSWORD VARCHAR(100),
    NICK VARCHAR(15) NOT NULL,
    PROVIDER VARCHAR(10) NOT NULL DEFAULT 'LOCAL',
    SNSID VARCHAR(40),
    PRIMARY KEY (UID)
);
`;

const CREATE_PROFILES = `
CREATE TABLE PROFILES (
    PID INT(10) NOT NULL AUTO_INCREMENT,
    ABOUT_ME VARCHAR(200),
    CAREER VARCHAR(1000),
    IMAGE_PATH VARCHAR(200),
    P_UID INT NOT NULL,
    FOREIGN KEY (P_UID) REFERENCES USERS(UID),
    PRIMARY KEY (PID)
);
`;

const CREATE_CATEGORY = `
CREATE TABLE CATEGORY (
    CAID INT(2) NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR(20) NOT NULL,
    PRIMARY KEY (CAID)
);
`;

const CREATE_LESSONS = `
CREATE TABLE LESSONS (
    LID INT(10) NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR(100) NOT NULL,
    CONTENT VARCHAR(1000) NOT NULL,
    PRICE VARCHAR(10) DEFAULT '0',
    COMPLETED CHAR(1) NOT NULL DEFAULT 'N',
    DELETE_AT CHAR(1) NOT NULL DEFAULT 'N',
    CDAT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UDAT DATETIME,
    DDAT DATETIME,
    L_NICK VARCHAR(15) NOT NULL,
    L_CAID INT NOT NULL,
    L_LOCID VARCHAR(30) NOT NULL,
    FOREIGN KEY (L_CAID) REFERENCES CATEGORY(CAID),
    
    PRIMARY KEY (LID)
);
`;

const CREATE_COMMENTS = `
CREATE TABLE COMMENTS (
    CID INT(10) NOT NULL AUTO_INCREMENT,
    PARENT_CID INT(10) NOT NULL DEFAULT 0,
    CONTENT VARCHAR(200) NOT NULL,
    DELETE_AT CHAR(1) NOT NULL DEFAULT 'N',    
    CDAT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UDAT DATETIME,
    DDAT DATETIME,
    C_LID INT NOT NULL,
    C_NICK VARCHAR(15) NOT NULL,
    FOREIGN KEY (C_LID) REFERENCES LESSONS(LID),
    PRIMARY KEY (CID)
);
`;

const CREATE_LOCATIONS = `
CREATE TABLE LOCATIONS (
    LOCID INT(10) NOT NULL AUTO_INCREMENT,
    LOC VARCHAR(30) NOT NULL,
    PRIMARY KEY(LOCID)
);
`;


exports.deleteAll = async () => {
    try {
        await db.promise().execute(DELETE_COMMENTS);
        await db.promise().execute(DELETE_LESSONS);
        await db.promise().execute(DELETE_PROFILES);
        await db.promise().execute(DELETE_USERS);
        await db.promise().execute(DELETE_CATEGORY);
        await db.promise().execute(DELETE_LOCATIONS);
    }
    catch(err) {
        console.error(err);
    }
};

/*
    ** 수정사항
    location 테이블 추가

*/
exports.createAll = async () => {
    try {
        await db.promise().execute(CREATE_CATEGORY);
        await db.promise().execute(CREATE_USERS);
        await db.promise().execute(CREATE_PROFILES);
        await db.promise().execute(CREATE_LESSONS);
        await db.promise().execute(CREATE_COMMENTS);
        await db.promise().execute(CREATE_LOCATIONS);

        await categoryData();
        await userData();
        await profileData();
        await lessonData();
        await commentData();
        await locationData();
    }
    catch(err) {
        console.error(err);
    }
};

/* 유저 데이터 입력 */
const userData = async () => {
    const hash = await encodePassword('gksrlfw123');
    const SQL1 = `INSERT INTO USERS(NICK, PASSWORD, EMAIL) VALUES('한길이', ?, 'gksrlfw@naver');`;
    await db.promise().execute(SQL1, [hash]);
}

/* 프로필 데이터 입력 */
const profileData = async () => {
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'testOutputImage');
    const SQL2 = `INSERT INTO PROFILES(ABOUT_ME, CAREER, IMAGE_PATH, P_UID) VALUES('제 이름은 서한길입니다', "['신입 준비 중', '여고유치원 졸업']", ?, '1');`;
    await db.promise().execute(SQL2, [imagePath]);
}

/* 카테고리 데이터 입력 */
const categoryData = async () => {
    const SQL1 = `INSERT INTO CATEGORY(TITLE) VALUES('운동');`;
    await db.promise().execute(SQL1);
    const SQL2 = `INSERT INTO CATEGORY(TITLE) VALUES('공부');`;
    await db.promise().execute(SQL2);
}

/* 위치 데이터 입력 */
const locationData = async () => {
    const SQL1 = `INSERT INTO LOCATIONS(LOC) VALUES('서울');`;
    await db.promise().execute(SQL1);
    const SQL2 = `INSERT INTO LOCATIONS(LOC) VALUES('부산');`;
    await db.promise().execute(SQL2);
}

/* 게시글 데이터 입력 */
const lessonData = async () => {
    const SQL1 = `INSERT INTO LESSONS(TITLE, CONTENT, PRICE, L_NICK, L_CAID, L_LOCID) 
                    VALUES('피아노 배우실 분!', '피아노 즐겁게 배우실 분 있으신가요??', '8500', '한길이', '1', '1');`;
    await db.promise().execute(SQL1);
}

/* 댓글 데이터 입력 */
const commentData = async () => {
    const SQL1 = `INSERT INTO COMMENTS(CONTENT, C_LID, C_NICK) 
                    VALUES('요일은 언제로 가능한가요??', '1', '두길이');`;
    await db.promise().execute(SQL1);
    const SQL2 = `INSERT INTO COMMENTS(PARENT_CID, CONTENT, C_LID, C_NICK) 
                    VALUES('1', '언제든지 가능합니다!', '1', '한길이');`;
    await db.promise().execute(SQL2);
}
