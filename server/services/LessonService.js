const db = require('../config/db');

class LessonService {

    constructor(db) {
        this.db = db;
    }

    async getFilterInfo() {
        try {
            console.log('service: getFilterInfo');
            let result = [];
            let SQL = `SELECT TITLE FROM CATEGORY`;
            let [results, fields] = await this.db.promise().execute(SQL);
            let category = results;

            SQL = `SELECT LOC FROM LOCATIONS`;
            [results, fields] = await this.db.promise().execute(SQL);
            let location = results;
            
            return { status: 200, message: { category, location } };
        }
        catch(err) {
            console.error(err);
        }
    }

    async getLessons(category, price, location) {
        try {
            console.log('service: getLessons', category, price, location);  // 공부, [500, 1000], 부산

            // 더 좋은 방법이 있을까??... price='???' 했을 때, ??? 키워드를 넣으면 그냥 전체가 탐색되도록 할 수 있으면 편할텐데..
            let price1, price2, SQL;
            let [results, fields] = [];
            
            /* 필터 유효성 검사 */
            if(category !== undefined) {
                SQL = `SELECT * FROM CATEGORY WHERE TITLE=?`;
                [results, fields] = await this.db.promise().execute(SQL, [category]);
                if(!results.length) return { status: 403, message: '존재하지 않는 필터입니다!' }
            }
            if(location !== undefined) {
                SQL = `SELECT * FROM LOCATIONS WHERE LOC=?`;
                [results, fields] = await this.db.promise().execute(SQL, [location]);
                if(!results.length) return { status: 403, message: '존재하지 않는 필터입니다!' }
            }
            if(price !== undefined) {
                price1 = Number(price.split(',')[0].replace(/\[/g, ''));
                price2 = Number(price.split(',')[1].replace(/\]/g, ''));
                if(price1 > price2) return { status: 403, message: '금액 범위에 오류가 있습니다!' };
            }

            /* 필터에 따른 검색 */
            if(category === undefined && location === undefined && price === undefined) {
                SQL = `SELECT * FROM LESSONS;`;
                [results, fields] = await this.db.promise().execute(SQL);
            }
            else if(category === undefined && location === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE PRICE >= ? AND PRICE <= ?;`;
                [results, fields] = await this.db.promise().execute(SQL, [price1, price2]);
            }
            else if(category === undefined && price === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE L_LOCID = (SELECT LOCID FROM LOCATIONS WHERE LOC=? );`;
                [results, fields] = await this.db.promise().execute(SQL, [location]);
            }
            else if(location === undefined && price === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE L_CAID = (SELECT CAID FROM CATEGORY WHERE TITLE=?);`;
                [results, fields] = await this.db.promise().execute(SQL, [category]);
            }
            else if(category === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE L_LOCID = (SELECT LOCID FROM LOCATIONS WHERE LOC=? ) AND PRICE >= ? AND PRICE <= ?;`;
                [results, fields] = await this.db.promise().execute(SQL, [location, price1, price2]);
            } 
            else if(price === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE L_CAID = (SELECT CAID FROM CATEGORY WHERE TITLE=?) AND LOCATION=?;`;
                [results, fields] = await this.db.promise().execute(SQL, [category, location]);
            }   
            else if(location === undefined) {
                SQL = `SELECT * FROM LESSONS WHERE L_CAID = (SELECT CAID FROM CATEGORY WHERE TITLE=?) AND PRICE >= ? AND PRICE <= ?;`;
                [results, fields] = await this.db.promise().execute(SQL, [category, price1,price2]);
            }   
            else {
                SQL = `SELECT * FROM LESSONS WHERE L_CAID = (SELECT CAID FROM CATEGORY WHERE TITLE=?) AND L_LOCID = (SELECT LOCID FROM LOCATIONS WHERE LOC=? ) AND PRICE >= ? AND PRICE <= ?;`;
                [results, fields] = await this.db.promise().execute(SQL, [category, location, price1, price2]);
            }   

            // 위에서 조인으로 만들기...
            let answer = results[0];
            const { L_CAID, L_LOCID } = results[0];
            SQL = `SELECT * FROM LOCATIONS WHERE LOCID=?`;
            [results, fields] = await this.db.promise().execute(SQL, [L_LOCID]);
            answer.location = results[0].LOC;

            SQL = `SELECT * FROM CATEGORY WHERE CAID=?`;
            [results, fields] = await this.db.promise().execute(SQL, [L_CAID]);
            answer.category = results[0].TITLE;

            return { status: 200, message: answer };
        }
        catch(err) {
            console.error(err);
        }
    }

    async writeLesson(title, nickname, detail, content, isProfile, imageInfo, videoInfo) {
        try {
            console.log('service: write lesson');
            let SQL, [results, fields] = [], LID=null, CID=null;

            SQL = `SELECT * FROM CATEGORY WHERE TITLE=?`;
            [results, fields] = await this.db.promise().execute(SQL, [detail.category]);
            if(!results.length) return { status: 403, message: '존재하지 않는 카테고리입니다!' };
            CID = results[0].CAID;
            
            
            SQL = `SELECT * FROM LOCATIONS WHERE LOC=?`;
            [results, fields] = await this.db.promise().execute(SQL, [detail.location]);
            if(!results.length) return { status: 403, message: '존재하지 않는 지역입니다!' };
            LID = results[0].LOCID;
            
            if(isProfile) isProfile='T';
            else isProfile='N';

            SQL = `INSERT INTO LESSONS(TITLE, CONTENT, PRICE, IMAGE_PATH, VIDEO_PATH, IS_PROFILE, L_NICK, L_CAID, L_LOCID) 
            VALUES(?,?,?,?,?,?,?,?,?);`;
            await db.promise().execute(SQL, [title, content, detail.price, imageInfo, videoInfo, isProfile, nickname, CID, LID]);
            return { status: 200, message: 'success' };
        }
        catch(err) {
            console.error(err);
        }
    }
    async getLessonInfo(lid) {
        try {
            console.log('service: getLessonInfo');
            let SQL = `SELECT * FROM LESSONS WHERE LID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [lid]);
            if(!results.length) return { status: 403, message: '존재하지 않는 게시글입니다! '};
            if(results[0].DELETE_AD === 'Y') return { status: 403, message: '이미 삭제된 게시글입니다! '};

            let lessonData = results[0];
            let views = results[0].VIEWS + 1;
            if(results[0].IS_PROFILE) {
                SQL = `SELECT * FROM PROFILES WHERE P_UID = (SELECT UID FROM USERS WHERE NICK=?)`;
                [results, fields] = await this.db.promise().execute(SQL, [results[0].L_NICK]);
                lessonData.aboutMe = results[0].ABOUT_ME;
                lessonData.career = results[0].CAREER;
            }
            
            SQL = `UPDATE LESSONS SET VIEWS=? WHERE LID=?`;
            await this.db.promise().execute(SQL, [views, lid]);
            return { status:200, message: lessonData };
        }
        catch(err) {
            console.error(err);
        }
    }

    async updateLessonInfo(lid, title, nickname, detail, content, isProfile, imageInfo, videoInfo) {
        try {
            console.log('service: updateLessonInfo');
            let SQL = `SELECT * FROM LESSONS WHERE LID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [lid]);
            if(!results.length) return { status: 403, message: '존재하지 않는 게시글입니다! '};
            if(results[0].DELETE_AD === 'Y') return { status: 403, message: '이미 삭제된 게시글입니다! '};

            let LID=null, CID=null;

            SQL = `SELECT * FROM CATEGORY WHERE TITLE=?`;
            [results, fields] = await this.db.promise().execute(SQL, [detail.category]);
            if(!results.length) return { status: 403, message: '존재하지 않는 카테고리입니다!' };
            CID = results[0].CAID;
            
            SQL = `SELECT * FROM LOCATIONS WHERE LOC=?`;
            [results, fields] = await this.db.promise().execute(SQL, [detail.location]);
            if(!results.length) return { status: 403, message: '존재하지 않는 지역입니다!' };
            LID = results[0].LOCID;
            
            if(isProfile) isProfile='T';
            else isProfile='N';

            SQL = `UPDATE LESSONS SET UDAT=CURRENT_TIMESTAMP, TITLE=?, CONTENT=?, PRICE=?, IMAGE_PATH=?, VIDEO_PATH=?, IS_PROFILE=?, L_CAID=?, L_LOCID=? 
                    WHERE LID=?`;
            await this.db.promise().execute(SQL, [title, content, detail.price, imageInfo, videoInfo, isProfile, CID, LID, lid]);
            return { status:200, message: 'success' };

        }
        catch(err) {
            console.error(err);
        }
    }

    async deleteLessonInfo(lid) {
        try {
            console.log('service: deleteLessonInfo');
            let SQL = `SELECT * FROM LESSONS WHERE LID=?`;
            let [results, fields] = await this.db.promise().execute(SQL, [lid]);
            if(!results.length) return { status: 403, message: '존재하지 않는 게시글입니다! '};
            if(results[0].DELETE_AD === 'Y') return { status: 403, message: '이미 삭제된 게시글입니다! '};

            SQL = `UPDATE LESSONS SET DELETE_AT=? WHERE LID=?`;
            [results, fields] = await this.db.promise().execute(SQL, ['T', lid]);
            return { status:200, message: 'success'};
        }
        catch(err) {
            console.error(err);
        }
    }
}

const lessonServiceInstance = new LessonService(db);
module.exports = lessonServiceInstance;