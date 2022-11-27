const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


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
