'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders_items', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },

      variantId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Add foreign key constraints if needed
    await queryInterface.addConstraint('orders_items', {
      type: 'foreign key',
      fields: ['variantId'],
      references: {
        table: 'products_variations',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('orders_items', {
      type: 'foreign key',
      fields: ['orderId'],
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders_items');
  }
};
