// models/Loan.js
const mongoose = require('mongoose');

// const repaymentSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   }
// }, { _id: false });

const loanSchema = new mongoose.Schema({
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  itemDescription: String,
  loanAmount: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    enum: ['bi-weekly', 'monthly'],
    required: true
  },
  interestPercent: {
    type: Number,
    default: 0
  },
  graceDays: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  remainingAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('loan', loanSchema);
