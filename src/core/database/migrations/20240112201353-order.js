'use strict';
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: uuidv4(),
        unique: true
      },

      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true
      },

      status: {
        allowNull: false,
        type: DataTypes.ENUM(...Object.values([
          "padding",
          "confirmed",
          "completed",
          "cancelled"
        ])),
        defaultValue: "padding"
      },


      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      phoneId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      paymentMethodId: {
        type: DataTypes.INTEGER,
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
    await queryInterface.addConstraint('orders', {
      type: 'foreign key',
      fields: ['userId'],
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      type: 'foreign key',
      fields: ['addressId'],
      references: {
        table: 'addresses',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      type: 'foreign key',
      fields: ['phoneId'],
      references: {
        table: 'phones',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      type: 'foreign key',
      fields: ['paymentMethodId'],
      references: {
        table: 'payments_methods',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
