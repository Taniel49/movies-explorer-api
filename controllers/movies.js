const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.postMovie = (req, res, next) => {
  const {
    // eslint-disable-next-line
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    // eslint-disable-next-line
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверные данные'));
      } else next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ _id: req.params.movieID })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('NotFoundError'));
      } else if (err.name === 'CastError') {
        next(new CastError('Неверный ID'));
      } else next(err);
    });
};
