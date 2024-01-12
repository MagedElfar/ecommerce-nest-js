'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_variations', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },

      productId: {
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
    await queryInterface.addConstraint('products_variations', {
      type: 'foreign key',
      fields: ['productId'],
      references: {
        table: 'products',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products_variations');
  }
};
