'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      storageKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "image"
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media');
  }
};
