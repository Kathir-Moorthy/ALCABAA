const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressLine: { type: String, required: true },
  landmark: { type: String, default: "" },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
});

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Firebase UID
  phone: { type: String, default: "" },
  addresses: { type: [addressSchema], default: [] },
});

module.exports = mongoose.model("Profile", profileSchema);