const express = require('express');
const router = express.Router();
const { test, testDB, testpost, testpost2 } = require('../controllers/exam');
const { authEmail, join, login, logout, relogin } = require('../controllers/auth');
const { getUserProfile, editUserPassword, editUserProfile, getMyPage } = require('../controllers/profile');
// const { getMain } = require('../controllers/main');
const { getLessons } = require('../controllers/lesson');

const { isLogin, isNotLogin } = require('../utils/authMiddleware');
const { verifyToken } = require('../utils/jsonwebtoken');



/* Test */
router.get('/', (req, res) => {
    res.send({ message: 'hello!!' });
});
router.get('/test', test);
router.get('/test/db', testDB);
router.get('/test/post', testpost);
router.get('/test/post2', testpost2);

/* Auth */
router.post('/auth/join/ecode', isNotLogin, authEmail);
router.post('/auth/join', isNotLogin, join);
router.post('/auth/login', isNotLogin, login);
router.get('/auth/logout', isLogin, logout);       //
router.get('/auth/relogin', verifyToken, isLogin, relogin);     //

/* User */
router.get('/user/profile/:uid', isLogin, getUserProfile);             //
router.put('/user/profile/edit/:uid', isLogin, editUserProfile);       //
router.put('/user/profile/editpw/:uid', isLogin, editUserPassword);    //
router.get('/user/mypage/:uid', isLogin, getMyPage);                   //

/* Main */
// router.get('/main', getMain);

/* Lesson */
router.get('/lesson', getLessons);

module.exports = router;