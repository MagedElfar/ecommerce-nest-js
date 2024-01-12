'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: false
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false
      },

      street: {
        type: DataTypes.STRING,
        allowNull: false
      },

      addressLine: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      userId: {
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
    await queryInterface.addConstraint('addresses', {
      type: 'foreign key',
      fields: ['userId'],
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
  }
};
