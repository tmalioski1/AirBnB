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
   options.tableName = 'SpotImages'
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://a0.muscache.com/im/pictures/b0c977d9-57ba-4f70-bbb4-8b3cd3ae8dc4.jpg?im_w=1200',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://a0.muscache.com/im/pictures/72b1b127-0601-4eb3-b4ae-729f4ca5c387.jpg?im_w=1440',
      preview: true
    },
     {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/559bdede-53d5-4f42-9851-e952a75409b7.jpg?im_w=1200',
      preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['url1', 'url2', 'url3'] }
    }, {});

  }
};
