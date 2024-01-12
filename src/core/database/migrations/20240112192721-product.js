'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
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


      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },

      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },

      brandId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },

      imageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
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
    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      fields: ['imageId'],
      references: {
        table: 'media',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      fields: ['categoryId'],
      references: {
        table: 'categories',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      fields: ['brandId'],
      references: {
        table: 'brands',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      fields: ['userId'],
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
