'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     options.tableName = 'Reviews'
     return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'fine',
        stars: 3
      },
      {
        spotId: 2,
        userId: 2,
        review: 'ok',
        stars: 2
      },
       {
        spotId: 3,
        userId: 3,
        review: 'amazing',
        stars: 5
      }
     ], {});

    },

    async down (queryInterface, Sequelize) {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
      options.tableName = 'Reviews';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        review: { [Op.in]: ['fine', 'ok', 'amazing'] }
      }, {});

    }
  };
