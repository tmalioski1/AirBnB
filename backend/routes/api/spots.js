const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


//Create an Image for a Spot//
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
  const { user } = req;
  if (user.id !== spot.ownerId) {
     throw new Error("spot must belong to the current user")
  }

  let spotId = spot.id
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,

  })
  return res.json({ "id": newImage.id, "url": newImage.url, "preview": newImage.preview })
});

//Get Reviews by SpotId//
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
   res.status(404);
   return res.json({
     "message": "Spot couldn't be found",
     "statusCode": 404
   })
 }

    const reviews = await Review.findAll({
      where : {
        spotId : req.params.spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    })

    res.json({'Reviews': reviews})

})
//Create a Review for a Spot//
router.post('/:spotId/reviews', requireAuth, async (req, res) => {

   const spot = await Spot.findByPk(req.params.spotId)
   if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  const { review, stars } = req.body;
  if (!review || stars < 1 || stars > 5) {
    return res.status(400).json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": [
        "Review text is required",
        "Stars must be an integer from 1 to 5",
      ]
    })
  }
  let userId = req.user.id
  const spotReviews = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: Review }
    ]
  })
  spotReviews.Reviews.forEach(review => {
      if (userId === review.userId) {
         return res.status(403).json({
          "message": "User already has a review for this spot",
          "statusCode": 403
         })
      }
  })

  let spotId = spot.id

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,

  })
   res.json(newReview)
});

//Get spots of Current User
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

//Get details of a Spot by Id//
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review
      },
      {
        model: SpotImage,
      },
      {
        model: User
      },
    ]
  })
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

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
    manipulatedSpot.SpotImages.forEach(image => {
      delete image.spotId
      delete image.createdAt
      delete image.updatedAt
    })
    manipulatedSpot.Owner = manipulatedSpot.User
    delete manipulatedSpot.Reviews
    delete manipulatedSpot.User
    delete manipulatedSpot.Owner.username
    res.json(manipulatedSpot)


})

//edit a Spot//
router.put('/:spotId', requireAuth, async (req, res) => {

   const spot = await Spot.findByPk(req.params.spotId)

   if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  const { user } = req;
  if (user.id !== spot.ownerId) {
     throw new Error("spot must belong to the current user")
  }

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

   spot.address = address;
   spot.city = city;
   spot.state = state;
   spot.country = country;
   spot.lat = lat;
   spot.lng = lng;
   spot.name = name;
   spot.description = description;
   spot.price = price

   await spot.save()

   res.json(spot)


})

//Get All Spots
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




//Create a Spot//
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
