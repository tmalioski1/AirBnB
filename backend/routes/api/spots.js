const express = require('express');

const { Spot, Review, SpotImage } = require('../../db/models');


const sequelize  = require("sequelize");

const router = express.Router();

router.get( '/',
    async (req, res) => {
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
        spot.SpotImages.forEach(image => {
            if (image.preview) {
            spot.previewImage = image.url
            }  else {
                spot.previewImage = 'needs an image'
            }
            delete spot.SpotImages
        })


      })


      return res.json(spotArray);
    //   return res.json({"Spots" : spots});
    }
  );




module.exports = router;
