'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM(["admin", "user", "vendor"]),
        allowNull: false,
        defaultValue: "user"
      },

      imageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
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
    await queryInterface.addConstraint('users', {
      type: 'foreign key',
      fields: ['imageId'],
      references: {
        table: 'media',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
