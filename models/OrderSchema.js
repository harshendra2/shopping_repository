const mongoose = require("mongoose");
const Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  product: [
    {
      id: { type: ObjectId },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      foodType: { type: String },
      Nonveg: { type: String },
      img: { type: String },
    },
  ],
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  veguest: {
    type: Number,
  },
  Nonvegguest: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    default: "processing",
  },
  address: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  subtotal: {
    type: Number,
  },
  orderId: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
