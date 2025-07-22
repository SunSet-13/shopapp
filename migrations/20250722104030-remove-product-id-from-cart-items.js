'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cart_items', 'product_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cart_items', 'product_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
