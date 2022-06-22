const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  postMovie, getAllMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2).max(120),
    // eslint-disable-next-line
    image: Joi.string().required().regex(/(http(s)?):\/\/(www\.)?[a-zA-Z0-9\-.]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*#?)/),
    // eslint-disable-next-line
    trailer: Joi.string().required().regex(/(http(s)?):\/\/(www\.)?[a-zA-Z0-9\-.]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*#?)/),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    movieId: Joi.string().required().hex().length(24),
  }),
}), postMovie);

router.delete('/movies/:movieID', celebrate({
  params: Joi.object().keys({
    movieID: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
