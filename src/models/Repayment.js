
const mongoose = require("mongoose");

const repaymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("repayment", repaymentSchema);
