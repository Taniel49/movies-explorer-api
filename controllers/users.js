const {
  NODE_ENV,
  JWT_SECRET,
  MONGO_DATABASE,
  MONGO_AUTH,
  MONGO_USER,
  MONGO_PASS,
} = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AufError');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('NotFoundError');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('NotFoundError');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Неверные данные'));
      } else if (err.name === 'CastError') {
        next(new CastError('Неверный ID'));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  console.log(
    MONGO_DATABASE,
    MONGO_AUTH,
    MONGO_USER,
    MONGO_PASS,
  );
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send(
        {
          data: {
            name: user.name,
            _id: user._id,
            email: user.email,
          },
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('1', req.body);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('2', user);
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'),
      });
    })
    .catch((err) => {
      console.log('3', err);
      if (err.name === 'AuthError') {
        next(new AuthError('Неправильная почта или пароль'));
      } else next(err);
    });
};
