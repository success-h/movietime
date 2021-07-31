const express = require("express");
const router = express.Router();
const uuid = require("uuidv4");
// Load User model
const User = require("../../models/User");
const Seat = require('../../models/Seat');
const SeatGenerator = require('../../lib/SeatGenerator');
const Movie = require("../../models/Movie")

const seatObj = {
  current: null,
  capacity: null
}

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/create", async (req, res) => {

  const {
    firstname,
    lastname,
    email,
    phone,
    prefferedDate,
    prefferedTime,
    tickets,
    movieId
  } = req.body;

  const bookingCode = String(uuid()).split("-")[0];
  let seatNumber = 0

  await User.find({})
    .then(users => {
      const allUsersWithTheSameDateAndTime = []
      
      if(users.length === 0) {
        seatNumber = 1;
      } else {
        users.forEach(user => {
          if(user.prefferedDate === prefferedDate && user.prefferedTime === prefferedTime) {
            allUsersWithTheSameDateAndTime.push(user)
          }
        })

        seatNumber = allUsersWithTheSameDateAndTime.length + 1
      }

      console.log(seatNumber, 1111111111)
    })
    .catch(err => {
      console.log(err)
    })

    console.log(seatNumber, 222222222)

  const user = await new User({
    firstname,
    lastname,
    email,
    phone,
    bookingCode,
    prefferedDate,
    prefferedTime,
    tickets,
    movieId,
    seatNumber
  });


  await user.save().then(user => {
    res.status(201).json({
      status: "ok",
      success: true,
      message: "User Created",
      user
    });
  }).catch(err => {
    res.status(400).json({
      status: 'not ok',
      success: false,
      message: "User not Created",
      err
    });
  })


});

router.get('/verifyTicket/:ticketId', (req, res) => {
  const id = req.params.ticketId

  User.find({reference: id})
    .then(userInfo => {
      let user = userInfo[0]
      let movieDetails = null
      Movie.find({id: user.movieId})
        .then(movies => {
          res.status(200).send({success: true, ticket: {user, movieDetails: movies[0]}})
        })
    })
    .catch(err => {
      res.status(404).json({error: true, message: "Ticket Not found, please book one"})
    })
})

router.patch("/update/:id", (req, res) => {
  const { reference } = req.body;
  User.findByIdAndUpdate(req.params.id, {reference}, {new: true})
    .then(user => {
      res.status(201).json({
        status: "ok",
        success: true,
        message: "User Updated",
        user
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'not ok',
        success: false,
        message: "User not Updated",
        err
      });
    })
});

router.get('/all', (req, res) => {
  User.find({})
    .then(users => {
      console.log(users)
    })
    .catch(err => {
      console.log(err)
    })
})
module.exports = router;
