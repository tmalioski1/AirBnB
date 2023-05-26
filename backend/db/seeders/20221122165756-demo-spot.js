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
      },
      {
        ownerId: 3,
        address: '504 Spring Rd.',
        city: 'San Diego',
        state: 'California',
        country: 'USA',
        lat: 9.2,
        lng: 7.3,
        name: "Jane's seaside villa",
        description: 'Tremendous seaside views',
        price: 75.60
      },
      {
        ownerId: 3,
        address: '505 Water Rd.',
        city: 'Wilmington',
        state: 'Tennessee',
        country: 'USA',
        lat: 12.2,
        lng: 7.3,
        name: "Rustic Canyon Retreat",
        description: 'Wonderful nature hideaway',
        price: 65.60
      },
      {
        ownerId: 3,
        address: '203 Alvin St.',
        city: 'Little Rock',
        state: 'Arkansas',
        country: 'USA',
        lat: 14.23,
        lng: 77.30,
        name: "Cozy Woods Hideway",
        description: 'A true delight for all nature lovers',
        price: 69.10
      },

      {
        ownerId: 3,
        address: '907 Viewport Rd.',
        city: 'Welling',
        state: 'California',
        country: 'USA',
        lat: 20.23,
        lng: 70.30,
        name: "Oceanside Getaway",
        description: 'A paradise for all beach lovers',
        price: 96.60
      },
      {
        ownerId: 3,
        address: '123 Broadway Ave.',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 10.23,
        lng: 86.30,
        name: "Jane's NYC Penthouse",
        description: 'The best way to enjoy Manhattan',
        price: 166.60
      },
      {
        ownerId: 3,
        address: '1245 River Rd.',
        city: 'Blem',
        state: 'Oregon',
        country: 'USA',
        lat: 23.23,
        lng: 69.30,
        name: "Northwest Paradise",
        description: 'Wonderful nature hideaway',
        price: 86.60
      },
      {
        ownerId: 3,
        address: '203 Something Rd.',
        city: 'Pitman',
        state: 'New Jersey',
        country: 'USA',
        lat: 23.23,
        lng: 99.30,
        name: "Jane's Small Town Bungalow",
        description: 'Wonderful weekend retreat',
        price: 56.60
      },


    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['301 Watercourt St.', '401 New St.', '502 Spring Rd.'] }
    }, {});
  }
};
