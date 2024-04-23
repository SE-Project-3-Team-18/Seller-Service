const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id; // Replace _id with id
      delete ret._id; // Remove _id
      delete ret.__v; // Remove __v
    },
  },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
