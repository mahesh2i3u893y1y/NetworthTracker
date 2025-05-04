
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type:String,
  },
  address:{
    type:String
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  creditLimit: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('customer', customerSchema);
