'use strict';

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
   await queryInterface.bulkInsert(
     "users",
     [
       {
         fullName: "user1",
         email: "user1@email.com",
         password: "$2b$10$UNmEUz5PvWv1Mr1.4TFG6evQCEsC.lAjf94Kva6R1.nwPhERAlane", //abc123
         phone: "12345678910",
         createdAt: 2022-03-15 03:57:09,
         updatedAt: 2022-03-15 03:57:09,
       },
     ],
     {}
   );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
