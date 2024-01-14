'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('products_variations', 'name', {
      type: Sequelize.STRING,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If needed, you can add code to revert the change here.
    // This depends on your specific requirements.
  },
};
