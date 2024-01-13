'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_variations_images', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      variationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      imageId: {
        type: DataTypes.INTEGER,
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

    await queryInterface.addConstraint('products_variations_images', {
      type: 'foreign key',
      name: "products_var_image_pro_var_fk",
      fields: ['variationId'],
      references: {
        table: 'products_variations',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('products_variations_images', {
      type: 'foreign key',
      name: "products_var_image_image_fk",
      fields: ['imageId'],
      references: {
        table: 'media',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products_variations_images');
  }
};
