const mongoose = require("mongoose");

const saleImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  order: { type: Number, required: true },
});

module.exports = mongoose.model("SaleImage", saleImageSchema);