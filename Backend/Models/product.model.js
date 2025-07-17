const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    category: {
      type: String, 
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    usedFrom: {
      type: Date,
      required: true,
    },
    usedTo: {
      type: Date,
      required: true,
    },
    distance: {
      type: Number, // Optional: Distance travelled for transport items
    },
    availability: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
