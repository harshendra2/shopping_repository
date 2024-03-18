const mongoose = require("mongoose");

const PackageCategorys = new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },
});

//create model
const PackageCategory = new mongoose.model("PackageCategory", PackageCategorys);
module.exports = PackageCategory;
