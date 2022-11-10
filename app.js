require('dotenv').config();

const {
  MONGO_DATABASE,
  MONGO_AUTH,
  MONGO_USER,
  MONGO_PASS,
} = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const signin = require('./routes/signin');
const signup = require('./routes/signup');

const { PORT = 8008 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://movies-frontend-5qvt.onrender.com',
    credentials: true,
  }),
);

mongoose.connect(
  MONGO_DATABASE,
  {
    useNewUrlParser: true,
    auth: {
      authdb: MONGO_AUTH,
      username: MONGO_USER,
      password: MONGO_PASS,
    },
  },
);

app.use(requestLogger);

app.use('/', signin);

app.use('/', signup);

app.use('/', auth, users);
app.use('/', auth, movies);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер');
});
