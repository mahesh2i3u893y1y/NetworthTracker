const express = require('express');
const customerRouter = express.Router();
const  customer = require("../models/customer")
const {authMiddleWare} = require("../middlewares/auth")

// ADDING THE CUSTOMER TO THE USER 

customerRouter.post('/customer', authMiddleWare, async (req, res) => {
  const { name, phone, address, trustScore, creditLimit } = req.body;


//   ALL WAYS TRUST SCORE SHOULD BE GREATER THAN ZERO AND LESS THAN TEN 

  if (!name || trustScore < 0 || trustScore > 10) {
    return res.status(400).json({ message: 'Invalid input: Name is required and trust score must be between 0–10' });
  }

  try {
    const newCustomer = new customer({
      shopkeeperId: req.user._id,      // user._id will come from the middleware
      name,
      phone,
      address,
      trustScore,
      creditLimit
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET ALL THE CUSTOMERS OF THE USER 

customerRouter.get('/getallcustomers', authMiddleWare, async (req, res) => {
    try {
      const customers = await customer.find({ shopkeeperId: req.user._id });
      res.status(200).json(customers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  // USER CAN EDIT THE USER DETAILS

  customerRouter.put('/customer/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const Customer = await customer.findOneAndUpdate(
        { _id: id, shopkeeperId: req.user._id }, // only update if owned by current shopkeeper
        updates,
        { new: true, runValidators: true }
      );
  
      if (!Customer) {
        return res.status(404).json({ message: 'Customer not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Customer updated', Customer });
    } catch (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  // DELETING THE CUSTOMER

  customerRouter.delete('/customer/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await customer.findOneAndDelete({
        _id: id,
        shopkeeperId: req.user._id
      });
  
      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


module.exports = customerRouter;
