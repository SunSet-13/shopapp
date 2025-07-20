'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        
      });
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'order_id',
        as: 'order_details'
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    total: DataTypes.INTEGER,
    phone: DataTypes.TEXT,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Order;
};