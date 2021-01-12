const db = require('../config/db');

class LessonService {

    constructor(db) {
        this.db = db;
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
    async writeLesson(nickname, detail, content, isProfile, imageInfo, videoInfo) {
        // try {
        //     console.log('service: write lesson');
        //     let SQL, [results, fields];
        //     if(isProfile) {
        //         SQL = `SELECT * FROM CATEGORY WHERE TITLE=?`;
        //         [results, fields] = await this.db.promise().execute(SQL, [category]);
        //         if(!results.length) return { status: 403, message: '존재하지 않는 필터입니다!' }
        //     }
        // }
        // catch(err) {
        //     console.error(err);
        // }
    }
}

const lessonServiceInstance = new LessonService(db);
module.exports = lessonServiceInstance;