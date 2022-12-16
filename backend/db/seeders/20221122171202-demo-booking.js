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
   options.tableName = 'Bookings'
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 2,
      startDate: '2022-02-16',
      endDate:   '2022-02-18',
    },
    {
      spotId: 2,
      userId: 3,
      startDate: '2022-04-03',
      endDate:  '2022-04-10',
    },
     {
      spotId: 3,
      userId: 1,
      startDate: '2022-07-10',
      endDate: '2022-07-17',
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
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2022-02-16', '2022-04-03', '2022-07-10'] }
    }, {});

  }
};
