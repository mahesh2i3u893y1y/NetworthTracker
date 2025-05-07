const express = require('express');
const loanRouter = express.Router();
const {authMiddleWare} = require("../middlewares/auth")
const loan = require('../models/loan');
const customer = require('../models/customer');

// POST /loans 
loanRouter.post('/customer/loan', authMiddleWare, async (req, res) => {
  const {
    customerId,
    itemDescription,
    loanAmount,
    issueDate,
    dueDate,
    frequency, 
    interestPercent,
    graceDays
  } = req.body;

  
  if (!customerId || !itemDescription || !loanAmount || !issueDate || !dueDate || !frequency) {
    return res.status(400).json({ message: 'Missing required loan fields' });
  }


  try {
  
    const Customer = await customer.findOne({ _id: customerId, shopkeeperId: req.user._id });
    if(loanAmount > Customer.creditLimit) return res.status(404).json({message:"Loan amount is greater than your credit limit"})

    if (!Customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    const Loan = new loan({
      shopkeeperId: req.user._id,
      customerId,
      itemDescription,
      loanAmount,
      issueDate,
      dueDate,
      frequency,
      interestPercent: interestPercent || 0,
      graceDays: graceDays || 0,
      status: 'pending',
      remainingAmount: loanAmount
    });

    await Loan.save();
    res.status(201).json({ message: 'Loan created successfully', loan });
  } catch (err) {
    console.error('Error creating loan:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



loanRouter.get('/customer/loan/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
  
    try {
      const Loan = await loan.findOne({
        _id: id,
        shopkeeperId: req.user._id
      }).populate('customerId', 'name phone address');
  
      if (!Loan) {
        return res.status(404).json({ message: 'Loan not found or unauthorized' });
      }
  
      res.status(200).json(Loan);
    } catch (err) {
      console.error('Error fetching loan details:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


loanRouter.patch('/customer/loan/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    const allowedUpdates = [
      'itemDescription',
      'loanAmount',
      'dueDate',
      'frequency',
      'interestPercent',
      'graceDays',
      'status'
    ];
  
    const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));
    if (!isValidUpdate) {
      return res.status(400).json({ message: 'Invalid fields in update request' });
    }
  
    try {
      const Loan = await loan.findOne({
        _id: id,
        shopkeeperId: req.user._id
      });
  
      if (!Loan) {
        return res.status(404).json({ message: 'Loan not found or unauthorized' });
      }
  
 
      Object.keys(updates).forEach(key => {
        Loan[key] = updates[key];
      });
    
  
      await Loan.save();
  
      res.status(200).json({ message: 'Loan updated successfully', loan });
    } catch (err) {
      console.error('Error updating loan:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });




// loanRouter.delete('/:id', authenticateUser, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const Loan = await loan.findOne({ _id: id, shopkeeperId: req.user.userId });
//     if (!Loan) {
//       return res.status(404).json({ message: 'Loan not found or unauthorized' });
//     }

//     // Optional safety: don't allow deletion if repayments exist
//     const repayments = await Repayment.find({ loanId: loan._id });
//     if (repayments.length > 0) {
//       return res.status(400).json({ message: 'Cannot delete loan with existing repayments' });
//     }

//     await loan.remove();
//     res.status(200).json({ message: 'Loan deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting loan:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


module.exports = loanRouter;
