const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


//Delete a Booking//
router.delete('/:bookingId', requireAuth, async (req, res) => {
   const deletedBooking = await Booking.findByPk(req.params.bookingId)
   if (!deletedBooking) {
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  }
  const spotConnect = await Booking.findByPk(req.params.bookingId, {
    include : [
      {
          model: Spot
      }
   ]
  })
  const { user } = req;
  if (user.id !== spotConnect.Spot.ownerId && user.id !== deletedBooking.userId) {
    throw new Error("Booking must belong to the current user or the Spot must belong to the current user")
  }

  const deleteDate = new Date()
  const preciseDeleteDate = deleteDate.getTime()

  const deletedStartDate = new Date(deletedBooking.startDate)
  const preciseStartDate = deletedStartDate.getTime()

  if (preciseDeleteDate >= preciseStartDate) {
    res.status(403);
    return res.json({
      "message": "Bookings that have been started can't be deleted",
      "statusCode": 403,
    })
  }
    await deletedBooking.destroy();
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
     })
})





//edit a Booking//
router.put('/:bookingId', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const start = new Date(startDate)
  const end = new Date(endDate)

  const booking = await Booking.findByPk(req.params.bookingId)
  if (!booking) {
   res.status(404);
   return res.json({
     "message": "Booking couldn't be found",
     "statusCode": 404
   })
 }
 const { user, spot } = req;
 if (user.id !== booking.userId) {
    throw new Error("booking must belong to the current user")
 }

 if (end <= start) {
  res.status(400);
  return res.json({
    "message": "Validation error",
    "statusCode": 400,
    "errors": [
      "endDate cannot be on or before startDate"
    ]
  })
}

const bookingStart = new Date(booking.startDate)
const bookingEnd = new Date(booking.endDate)
if ((start >= bookingStart && start <= bookingEnd) || (end >= bookingStart && end <= bookingEnd))
{
 res.status(403);
 return res.json({
   "message": "Sorry, this spot is already booked for the specified dates",
   "statusCode": 403,
   "errors": [
     "Start date conflicts with an existing booking",
     "End date conflicts with an existing booking"
   ]
 })
}

const todayDate = new Date()
const bookingTimeMiliSeconds = todayDate.getTime()
const bookingEndMiliSeconds = bookingEnd.getTime()


if (bookingTimeMiliSeconds > bookingEndMiliSeconds) {
  res.status(403);
  return res.json({
    "message": "Past bookings can't be modified",
    "statusCode": 403,
  })
}


  booking.userId = user.id;
  booking.startDate = startDate;
  booking.endDate = endDate


  await booking.save()

  return res.json(booking)

})

//Get All Current User's Bookings//
router.get('/current', requireAuth, async (req, res) => {

  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      }
    ]
  })
  const manipulatedSpots = await Spot.findAll({

    include: [
     {
     model: SpotImage,
     }
    ],
  })

 let bookingsArray = [];
 bookings.forEach(booking => {
   bookingsArray.push(booking.toJSON())
 })

 let manipulatedSpotArray = []
 manipulatedSpots.forEach(spot => {
   manipulatedSpotArray.push(spot.toJSON())
 })

 manipulatedSpotArray.forEach(spot => {
   spot.SpotImages.forEach(image => {
     if (image.preview) {
       spot.previewImage = image.url
     } else {
       spot.previewImage = 'needs an image'
     }
     delete spot.SpotImages
   })

 })

 bookingsArray.forEach(booking => {
   manipulatedSpotArray.forEach(spot => {
     if (booking.spotId === spot.id) {
           booking.Spot.previewImage = spot.previewImage
     }
   })
 })

 const deconstructedBookingsArray = []
 bookingsArray.forEach(booking => {
   deconstructedBookingsArray.push({ 'id': booking.id, 'spotId': booking.spotId, 'Spot': booking.Spot, 'userId': booking.userId, 'startDate': booking.startDate, 'endDate': booking.endDate, 'createdAt': booking.createdAt, 'updatedAt': booking.updatedAt })
 })

  res.json({ "Bookings": deconstructedBookingsArray })

});





module.exports = router;
