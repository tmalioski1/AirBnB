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
      url: 'https://a0.muscache.com/im/pictures/db2e7230-23db-4479-b6fe-b50963babeb6.jpg?im_w=1200',
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
    },
      {
      spotId: 4,
      url: 'https://a0.muscache.com/im/pictures/34ca7926-03f2-4713-9a42-1b1ed9fb5c43.jpg?im_w=1200',
      preview: true
    },
      {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-48246773/original/22a2c42e-108b-4809-b274-ada4f3d6da28.jpeg?im_w=1200',
      preview: true
    },
      {
      spotId: 6,
      url: 'https://a0.muscache.com/im/pictures/c88d4356-9e33-4277-83fd-3053e5695333.jpg?im_w=1200',
      preview: true
    },
      {
      spotId: 7,
      url: 'https://a0.muscache.com/im/pictures/2e5ce6c9-4935-49ce-891e-e6f7251a8590.jpg?im_w=1200',
      preview: true
    },
      {
      spotId: 8,
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-49381739/original/ddca4b48-7044-4e29-8978-540dc9415df0.jpeg?im_w=1200',
      preview: true
    },
      {
      spotId: 9,
      url: 'https://a0.muscache.com/im/pictures/1e16f2f4-1256-44cb-a0f2-85aa57672a45.jpg?im_w=1200',
      preview: true
    },
      {
      spotId: 10,
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/a0965aa5-3907-466e-b727-0900e2a7e8c7.jpeg?im_w=1200',
      preview: true
    },
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
