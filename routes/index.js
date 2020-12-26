const express = require('express');
const { test, testDB, testpost, testpost2 } = require('../controllers/test');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({ message: 'hello!!' });
})
router.get('/test', test);
router.get('/test/db', testDB);
router.get('/test/post', testpost);
router.get('/test/post2', testpost2);


module.exports = router;