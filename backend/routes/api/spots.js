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
        let spotCount = 0
        let starsSum = 0
        spot.Reviews.forEach(review => {
           starsSum += review.stars
           spotCount++
        })
            spot.avgStarRating = starsSum/spotCount
            delete spot.Reviews
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

        // attributes: {
        //     include: [
        //         [
        //             sequelize.fn("AVG", sequelize.col("Reviews.stars")),
        //             "avgSpotRatings"
        //         ]
        //     ],
        // },
        // include: {
        //     model: Review,
        //     attributes: []
        // },


      })


      return res.json(spotArray);
    //   return res.json({"Spots" : spots});
    }
  );




module.exports = router;
