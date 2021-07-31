const express = require("express");
const router = express.Router();

// Load User model
const Movie = require("../../models/Movie");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/create", (req, res) => {
  const { title, id, runtime } = req.body;
  console.log(title, id, runtime)
  const movie = new Movie({
    title,
    id,
    runtime
  });

  movie
    .save()
    .then(movie => {
      console.log(movie);
      res.status(201).json({
        status: 'ok',
        success: true,
        message: "Movie Created",
        movie
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).json({
        status: 'not ok',
        success: false,
        message: "Movie not Created",
        err
      });
    });
});

module.exports = router;
