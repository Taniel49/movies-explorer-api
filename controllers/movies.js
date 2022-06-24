const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getAllMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.postMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
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
  Movie.findById(req.params.movieID)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('NotFoundError');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нет доступа');
      } return movie.remove()
        .then(() => {
          res.send({ data: movie });
        });
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неверный ID'));
      } else next(err);
    });
};
