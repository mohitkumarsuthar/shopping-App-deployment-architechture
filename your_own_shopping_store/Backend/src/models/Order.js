import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
import User from "./User.js" 
import Product from "./Product.js"


export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("COD", "ONLINE"),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("PENDING", "PAID"),
    defaultValue: "PENDING",
  },
  razorpayOrderId: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"),
    defaultValue: "PENDING",
  },
})



export const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
})


User.hasMany(Order, { foreignKey: "userId" })
Order.belongsTo(User, { foreignKey: "userId" })

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" })
OrderItem.belongsTo(Order, { foreignKey: "orderId" })

Product.hasMany(OrderItem, { foreignKey: "productId" })
OrderItem.belongsTo(Product, { foreignKey: "productId" })
