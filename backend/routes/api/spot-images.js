const express = require('express');
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('./session')

const sequelize = require("sequelize");


//Delete a Spot Image//
router.delete('/:spotImageId', requireAuth, async (req, res) => {
    const image = await SpotImage.findByPk(req.params.spotImageId)
    if (!image) {
        res.status(404);
     return res.json({
      "message": "Spot Image couldn't be found",
      "statusCode": 404
    })
    }
  const spotImageConnect = await SpotImage.findByPk(req.params.spotImageId, {
     include : [
        {
            model: Spot
        }
     ]
  })
    const { user } = req;
    if (user.id !== spotImageConnect.Spot.ownerId) {
     throw new Error("Spot Image must belong to the current user")
  }
   await image.destroy();
   return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
   })
});



module.exports = router;
