
const express = require('express');
const repaymentRouter = express.Router();
const {authMiddleWare} = require("../middlewares/auth")
const loan = require('../models/loan');
const repayment = require("../models/Repayment")



repaymentRouter.post('/coustomer/loan/repayment/:id', authMiddleWare, async (req, res) => {
    const loanId = req.params.id;
    const { amount, date } = req.body;
  
    try {
      const Loan = await loan.findOne({ _id: loanId, shopkeeperId: req.user._id });
  
      if (!Loan) {
        return res.status(404).json({ message: 'Loan not found or unauthorized' });
      }
  
      if (amount <= 0) {
        return res.status(400).json({ message: 'Repayment amount must be greater than 0' });
      }
  
      if (amount > Loan.remainingAmount) {
        return res.status(400).json({ message: 'Repayment exceeds remaining loan amount' });
      }
  
      const Repayment = new repayment({
        loanId,
        shopkeeperId: req.user._id,
        amount,
        date: date || new Date()
      });
  
      await Repayment.save();
  
      Loan.remainingAmount -= amount;
      if (Loan.remainingAmount <= 0) {
        Loan.status = 'paid';
        Loan.remainingAmount = 0;
      }
  
      await Loan.save();
  
      res.status(201).json({ message: 'Repayment recorded', Repayment });
    } catch (err) {
      console.error('Error adding repayment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


repaymentRouter.get('/loan/repayments/:id', authMiddleWare, async (req, res) => {
    const loanId = req.params.id;

    try {
      const Loan = await loan.findOne({ _id: loanId, shopkeeperId: req.user._id });
      if (!Loan) {
        return res.status(404).json({ message: 'Loan not found or unauthorized' });
      }
  
      const Repayments = await repayment.find({ loanId }).sort({ date: -1 });
  
      res.status(200).json({ loanId, Repayments });
    } catch (err) {
      console.error('Error fetching repayments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = repaymentRouter;
  