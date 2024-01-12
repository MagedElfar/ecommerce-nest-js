'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_sub_categories', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      subCategoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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

    await queryInterface.addConstraint('products_sub_categories', {
      type: 'foreign key',
      fields: ['productId'],
      references: {
        table: 'products',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('products_sub_categories', {
      type: 'foreign key',
      fields: ['subCategoryId'],
      references: {
        table: 'seb_categories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products_sub_categories');
  }
};
