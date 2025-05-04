const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const express = require('express');
const receiptRouter = express.Router();

const { authMiddleWare } = require('../middlewares/auth');
const repayment = require('../models/Repayment');
const loan = require('../models/loan');
const User = require('../models/User');

receiptRouter.get('/repayments/receipt/:id', authMiddleWare, async (req, res) => {
  try {
    const repaymentId = req.params.id;
    const shopkeeperId = req.user._id;

    const Repayment = await repayment.findOne({ _id: repaymentId, shopkeeperId });
    if (!Repayment) return res.status(404).json({ message: 'Repayment not found' });

    const Loan = await loan.findOne({ _id: Repayment.loanId }).populate('customerId');
    if (!Loan) return res.status(404).json({ message: 'Loan not found' });

    const shopkeeper = await User.findById(shopkeeperId);
    const Customer = Loan.customerId;

    // Load HTML template
    const templatePath = path.join(__dirname, '../templates/template.html');
    let html = fs.readFileSync(templatePath, 'utf8');


    // const backgroundImagePath = path.join(__dirname, "../../assets", "pronoia.png");
    // const backgroundImageBase64 = fs.readFileSync(backgroundImagePath, { encoding: "base64" });
    // const logoDataUri = `data:image/png;base64,${backgroundImageBase64}`;

    // Build logo URL
    // const logoUrl = `${req.protocol}://${req.get('host')}/assets/logo.png`;

    // Replace placeholders
    html = html.replace('{{shopkeeperName}}', shopkeeper.name)
      .replace('{{shopkeeperEmail}}', shopkeeper.email)
      .replace('{{customerName}}', Customer.name)
      .replace('{{customerPhone}}', Customer.phone)
      .replace('{{customerAddress}}', Customer.address)
      .replace('{{itemDescription}}', Loan.itemDescription)
      .replace('{{loanAmount}}', Loan.loanAmount.toFixed(2))
      .replace('{{amountPaid}}', Repayment.amount.toFixed(2))
      .replace('{{remainingAmount}}', Loan.remainingAmount.toFixed(2))
      .replace('{{paymentDate}}', new Date(Repayment.date).toLocaleString())
    //   .replace('{{logoUrl}}', logoUrl);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Ensure Repayments folder exists
    const outputDir = path.join(__dirname, "../../Repayments");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Write PDF file
    const filePath = path.join(outputDir, `receipt-${repaymentId}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    // Send file as response
    res.download(filePath);

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Failed to generate receipt' });
  }
});

module.exports = receiptRouter;
