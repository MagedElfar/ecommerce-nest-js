'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_variations_attributes', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      productVariationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      attrId: {
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

    await queryInterface.addConstraint('products_variations_attributes', {
      type: 'foreign key',
      name: "products_var_attr_productVariationId_products_var_fk",
      fields: ['productVariationId'],
      references: {
        table: 'products_variations',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('products_variations_attributes', {
      type: 'foreign key',
      name: "products_var_attr_attr_fk",
      fields: ['attrId'],
      references: {
        table: 'attributes_values',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products_variations_attributes');
  }
};
