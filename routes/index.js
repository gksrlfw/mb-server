const express = require('express');
const router = express.Router();
const { test, testDB, testpost, testpost2 } = require('../controllers/test');
const { authEmail, join, login } = require('../controllers/auth');
const { isNotSignIn } = require('../utils/validation');

router.get('/', (req, res) => {
    res.send({ message: 'hello!!' });
})

/* Test */
router.get('/test', test);
router.get('/test/db', testDB);
router.get('/test/post', testpost);
router.get('/test/post2', testpost2);

/* Auth */
router.post('/auth/join/ecode', authEmail);
router.post('/auth/join',isNotSignIn, join);
router.post('/auth/login', login);

/* Lesson */

module.exports = router;