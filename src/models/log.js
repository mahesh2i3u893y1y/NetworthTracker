
const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  repaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repayment'
  },
  payload: mongoose.Schema.Types.Mixed,
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', webhookLogSchema);
