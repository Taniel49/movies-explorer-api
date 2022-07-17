const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  postMovie, getAllMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/(http(s)?):\/\/(www\.)?[a-zA-Z0-9\-.]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*#?)/),
    trailerLink: Joi.string().required().regex(/(http(s)?):\/\/(www\.)?[a-zA-Z0-9\-.]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*#?)/),
    thumbnail: Joi.string().required().regex(/(http(s)?):\/\/(www\.)?[a-zA-Z0-9\-.]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*#?)/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), postMovie);

router.delete('/movies/:movieID', celebrate({
  params: Joi.object().keys({
    movieID: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
