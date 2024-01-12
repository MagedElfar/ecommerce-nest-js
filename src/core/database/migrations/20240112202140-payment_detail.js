'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments_details', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      chargeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      paymentStatus: {
        type: DataTypes.ENUM([
          "succuss",
          "failed",
          "padding"
        ]),
        allowNull: false,
        defaultValue: "padding"

      },

      paymentMethodId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },

      orderId: {
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
    await queryInterface.addConstraint('payments_details', {
      type: 'foreign key',
      name: "payments_details_order_fk",
      fields: ['orderId'],
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('orders', {
      type: 'foreign key',
      name: "payments_details_py_fk",
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
    await queryInterface.dropTable('payments_details');
  }
};
