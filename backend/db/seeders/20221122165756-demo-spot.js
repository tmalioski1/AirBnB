'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '301 Watercourt St.',
        city: 'Las Vegas',
        state: 'Nevada',
        country: 'USA',
        lat: 3.4,
        lng: 3.3,
        name: "Bob's spot",
        description: 'good for the price',
        price: 33.50
      },
      {
        ownerId: 2,
        address: '401 New St.',
        city: 'Pittsburg',
        state: 'Pennsylvania',
        country: 'USA',
        lat: 4.0,
        lng: 4.1,
        name: "John's house",
        description: 'nice view',
        price: 44.30
      },
      {
        ownerId: 3,
        address: '502 Spring Rd.',
        city: 'Orlando',
        state: 'Florida',
        country: 'USA',
        lat: 6.2,
        lng: 6.3,
        name: "Jane's villa",
        description: 'luxurious',
        price: 55.60
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['502 Spring Rd.', '401 New St.', '502 Spring Rd.'] }
    }, {});
  }
};
