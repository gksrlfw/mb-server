/*
    테이블 생성 및 삭제
*/

const db = require('./db');
const { encodePassword } = require('../utils/bcrypt');

const DELETE_COMMENTS = `DROP TABLE COMMENTS;`;
const DELETE_LESSONS = `DROP TABLE LESSONS;`;
const DELETE_PROFILES = `DROP TABLE PROFILES;`;
const DELETE_USERS = `DROP TABLE USERS;`;
const DELETE_CATEGORY = `DROP TABLE CATEGORY;`;

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
    LOCATION VARCHAR(10),
    PRICE VARCHAR(10) DEFAULT '0',
    CDAT DATETIME NOT NULL,
    UDAT DATETIME,
    DDAT DATETIME,
    L_NICK VARCHAR(15) NOT NULL,
    L_CAID INT NOT NULL,
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
    COMPLETED CHAR(1) NOT NULL DEFAULT 'N',
    CDAT DATETIME NOT NULL,
    UDAT DATETIME,
    DDAT DATETIME,
    C_LID INT NOT NULL,
    C_NICK VARCHAR(15) NOT NULL,
    FOREIGN KEY (C_LID) REFERENCES LESSONS(LID),
    PRIMARY KEY (CID)
);
`;


exports.deleteAll = async () => {
    try {
        await db.promise().execute(DELETE_COMMENTS);
        await db.promise().execute(DELETE_LESSONS);
        await db.promise().execute(DELETE_PROFILES);
        await db.promise().execute(DELETE_USERS);
        await db.promise().execute(DELETE_CATEGORY);
    }
    catch(err) {
        console.error(err);
    }
};

exports.createAll = async () => {
    try {
        await db.promise().execute(CREATE_CATEGORY);
        await db.promise().execute(CREATE_USERS);
        await db.promise().execute(CREATE_PROFILES);
        await db.promise().execute(CREATE_LESSONS);
        await db.promise().execute(CREATE_COMMENTS);

        const hash = await encodePassword('gksrlfw123');
        const SQL = `INSERT INTO USERS(NICK, PASSWORD, EMAIL) VALUES('한길이', ?, 'gksrlfw@naver');`;
        await db.promise().execute(SQL, [hash]);
    }
    catch(err) {
        console.error(err);
    }
};