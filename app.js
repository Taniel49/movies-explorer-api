require('dotenv').config();

const { NODE_ENV, MONGO_DATABASE } = process.env;
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

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://mydiploma.students.nomoreparties.sbs',
    credentials: true,
  }),
);

mongoose.connect(
  NODE_ENV === 'production' ? MONGO_DATABASE : 'mongodb://localhost:27017/moviesdb',
  {
    useNewUrlParser: true,
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
