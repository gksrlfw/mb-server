const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const { checkDir } = require('./utils/fs');
const db = require('./config/db');
const passportConfig = require('./utils/passport');
const { createAll, deleteAll } = require('./config/table');

dotenv.config();
passportConfig();

console.log('dotenv:', process.env.PORT, process.env.PROD_HOST, process.env.PROD_NAME, process.env.JWT_SECRET, process.env.MAIL_EMAIL, process.env.COOKIE_SECRET);
checkDir('/public/images');
checkDir('/public/videos');
checkDir('/public/images/profiles');
checkDir('/public/images/lessons');
checkDir('/public/videos/lessons');
checkDir('/public/videos/m3u8');

const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 3000);

db.connect((err) => {
  if(err) throw err;
  console.log('mysql connected...');
});

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  proxy: true
}

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
  // sessionOption.cookie.secure = true; // HTTPS 적용시 주석 풀기

  (async () => {
    try {
      const SQL = `SELECT * FROM USERS`;
      const [results, fields] = await db.promise().execute(SQL);
      if(results.length) return;
      await deleteAll();
    }
    catch(err) {
      console.error(err);
      await createAll();
    }
  })();
}
else app.use(morgan('dev'));

app.enable('trust proxy');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image/lesson', express.static(path.join(__dirname, 'public/images/lessons'))); // /img에서 요청하면 public/images/lessons 폴더에 있는 파일을 준다
app.use('/image/profile', express.static(path.join(__dirname, 'public/images/profiles')));
app.use('/video/lesson', express.static(path.join(__dirname, 'public/videos/lessons')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api', indexRouter)

app.use((req, res, next) => {
  res.status(404).send(`해당 페이지가 존재하지 않습니다!!!!`);
});


// 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

module.exports = app;



