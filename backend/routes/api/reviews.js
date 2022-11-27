const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


//Create an Image for a Review//
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { url } = req.body;
  const review = await Review.findByPk(req.params.reviewId)
  if (!review) {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }
  const { user } = req;
  if (user.id !== review.userId) {
     throw new Error("review must belong to the current user")
  }
  let reviewId = review.id

  const imageCounter = await Review.findByPk(req.params.reviewId, {
     include: [
        { model: ReviewImage }
     ]
  })

  if (imageCounter.ReviewImages.length  > 10) {
    res.status(403);
    return res.json({
      "message": "Maximum number of images for this resource was reached",
      "statusCode": 403
    })
  }

  const newImage = await ReviewImage.create({
    reviewId,
    url,
  })
  return res.json( { "id": newImage.id, "url": newImage.url} )
});

//edit a Review//
router.put('/:reviewId', requireAuth, async (req, res) => {

  const editedReview = await Review.findByPk(req.params.reviewId)

  if (!editedReview) {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  const { user } = req;
  if (user.id !== editedReview.userId) {
     throw new Error("spot must belong to the current user")
  }

  const { review, stars } = req.body
if (!review || !stars || stars < 1 || stars > 5 ) {
  return res.status(400).json({
    "message": "Validation Error",
    "statusCode": 400,
    "errors": [
      "Review text is required",
      "Stars must be an integer from 1 to 5",
    ]
  })
}


editedReview.review = review;
editedReview.stars = stars;


await editedReview.save()

res.json(editedReview)





})


//Get Reviews of Current User
router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id

    },
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      },

    ]
  })
   const manipulatedSpots = await Spot.findAll({

     include: [
      {
      model: SpotImage,
      // attributes: [['url', 'previewImage']]
      }
     ],
   })
  let reviewArray = [];
  reviews.forEach(review => {
    reviewArray.push(review.toJSON())
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

  reviewArray.forEach(review => {
    manipulatedSpotArray.forEach(spot => {
      if (review.spotId === spot.id) {
            review.Spot.previewImage = spot.previewImage
      }
    })
  })
  console.log(reviewArray)

  return res.json({ "Reviews": reviewArray })

});




module.exports = router;
