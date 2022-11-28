const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


//Delete a Review Image//
router.delete('/:reviewImageId', requireAuth, async (req, res) => {
   const reviewImg = await ReviewImage.findByPk(req.params.reviewImageId)

   if (!reviewImg) {
    res.status(404);
    return res.json({
     "message": "Review Image couldn't be found",
     "statusCode": 404
   })
   }

   const reviewImageConnect = await ReviewImage.findByPk(req.params.reviewImageId, {
    include : [
       {
           model: Review
       }
    ]
 })
    const { user } = req;

    if (user.id !== reviewImageConnect.Review.userId){
        throw new Error("Review Image must belong to the current user")
     }

     await reviewImg.destroy();
     return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
     })


});



module.exports = router;
