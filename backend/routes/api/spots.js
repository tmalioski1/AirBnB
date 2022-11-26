const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");

const router = express.Router();


router.get('/current', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    },
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
      }
    ]
  })
  let spotArray = [];
  spots.forEach(spot => {
    spotArray.push(spot.toJSON())
  })

  spotArray.forEach(spot => {
    let spotCount = 0
    let starsSum = 0
    spot.Reviews.forEach(review => {
      starsSum += review.stars
      spotCount++
    })
    spot.avgRating = starsSum / spotCount
    delete spot.Reviews
  })

  spotArray.forEach(spot => {
    spot.SpotImages.forEach(image => {
      if (image.preview) {
        spot.previewImage = image.url
      } else {
        spot.previewImage = 'needs an image'
      }
      delete spot.SpotImages
    })

  })

  res.json({ "Spots": spotArray })

});

router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
      },
      {
        model: User
      },
    ]
  })
    let manipulatedSpot = spot.toJSON()

    manipulatedSpot.numReviews = manipulatedSpot.Reviews.length
    let starsSum = 0
    manipulatedSpot.Reviews.forEach(review => {
      starsSum += review.stars
    })

    manipulatedSpot.avgStarRating = starsSum / manipulatedSpot.Reviews.length
    manipulatedSpot.placeHolderSpotImages = manipulatedSpot.SpotImages
    delete manipulatedSpot.SpotImages
    manipulatedSpot.SpotImages = manipulatedSpot.placeHolderSpotImages
    delete manipulatedSpot.placeHolderSpotImages
    manipulatedSpot.Owner = manipulatedSpot.User
    delete manipulatedSpot.Reviews
    delete manipulatedSpot.User
    delete manipulatedSpot.Owner.username
    res.json(manipulatedSpot)


})

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
      include: [
        {
          model: Review
        },
        {
          model: SpotImage
        }
      ]
    })


    let spotArray = [];
    spots.forEach(spot => {
      spotArray.push(spot.toJSON())
    })

    spotArray.forEach(spot => {
      let spotCount = 0
      let starsSum = 0
      spot.Reviews.forEach(review => {
        starsSum += review.stars
        spotCount++
      })
      spot.avgRating = starsSum / spotCount
      delete spot.Reviews
    })

    spotArray.forEach(spot => {
      spot.SpotImages.forEach(image => {
        if (image.preview) {
          spot.previewImage = image.url
        } else {
          spot.previewImage = 'needs an image'
        }
        delete spot.SpotImages
      })

    })


    return res.json({ "Spots": spotArray });
  }
);

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  let spotId = spot.id
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,

  })
  return res.json({ "id": newImage.id, "url": newImage.url, "preview": newImage.preview })
});

router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
    return res.status(400).json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": [
        "Street address is required",
        "City is required",
        "State is required",
        "Country is required",
        "Latitude is not valid",
        "Longitude is not valid",
        "Name must be less than 50 characters",
        "Description is required",
        "Price per day is required"
      ]
    })
  }



  const newSpot = await Spot.create({

    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })
  res.status(201)
  return res.json(newSpot)
}
);



module.exports = router;
