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
  console.log('length----------------', imageCounter.ReviewImages.length)

  const newImage = await ReviewImage.create({
    reviewId,
    url,
  })
  return res.json( { "id": newImage.id, "url": newImage.url} )
});





module.exports = router;
