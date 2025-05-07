const express = require('express');
const summaryRouter = express.Router();
const {authMiddleWare} = require("../middlewares/auth")
const loan = require("../models/loan");
const repayment = require("../models/Repayment");

summaryRouter.get('/summary', authMiddleWare, async (req, res) => {
  try {
    const shopkeeperId = req.user._id;

    const loans = await loan.find({ shopkeeperId });
    const repayments = await repayment.find({ shopkeeperId });

    const totalLoaned = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);
    const totalCollected = repayments.reduce((sum, r) => sum + r.amount, 0);

    
    const today = new Date();
    const overdueLoans = loans.filter(loan => loan.dueDate < today && loan.remainingAmount > 0);
    const overdueAmount = overdueLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

   
    const paidLoans = loans.filter(loan => loan.status === 'paid');
    let totalDays = 0;
    let count = 0;

    for (const loan of paidLoans) {
      const repaymentsForLoan = repayments
        .filter(r => r.loanId.toString() === loan._id.toString())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (repaymentsForLoan.length > 0) {
        const lastRepaymentDate = repaymentsForLoan[0].date;
        const issueDate = new Date(loan.issueDate);
        const diffDays = Math.ceil((new Date(lastRepaymentDate) - issueDate) / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
        count++;
      }
    }

    const avgRepaymentTime = count > 0 ? (totalDays / count).toFixed(2) : 0;

    res.json({
      totalLoaned,
      totalCollected,
      overdueAmount,
      avgRepaymentTime: Number(avgRepaymentTime)
    });

  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = summaryRouter;
