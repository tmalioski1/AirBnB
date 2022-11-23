const express = require('express');

const { Spot, Review, SpotImage } = require('../../db/models');


const sequelize  = require("sequelize");

const router = express.Router();

router.get( '/',
    async (req, res) => {
      const spots = await Spot.findAll( {
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                    "avgSpotRatings"
                ]
            ],
        },
        include: {
            model: Review,
            attributes: []
        },
        include: {
            model: SpotImage,
            attributes: []
        }
      })
      return res.json(spots);
    }
  );



module.exports = router;
