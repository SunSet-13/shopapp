'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cart_items', 'product_variant_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'product_variant_values',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cart_items', 'product_variant_id');
  }
};
