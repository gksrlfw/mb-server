const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./utils/passport');
const db = require('./config/db');
const { createAll, deleteAll } = require('./config/table');

dotenv.config();
passportConfig();

const indexRouter = require('./routes');

const app = express();
app.set('port', 3000);

db.connect((err) => {
  if(err) throw err;
  console.log('mysql connected...');
});

(async () => {
  try {
    // await deleteAll();
    // await createAll();
  }
  catch(err) {
    console.error(err);
  }
})();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter)

app.use((req, res, next) => {
  // res.status(404).send(`${req.method} ${req.url} 라우터가 없습니다.`);
  res.status(404).send(`해당 페이지가 존재하지 않습니다!!!!`);
});


// 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

module.exports = app;



