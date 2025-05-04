# 🛍️ Shopkeeper Credit Management Backend

This is a RESTful backend service that helps small business owners (like kirana stores, tailors, hardware shops, etc.) 
manage credit sales to customers. It allows shopkeepers to record loans (credit sales), track repayments, get payment reminders, 
and generate downloadable receipts — all through a secure, user-specific API system.

---

credentails to test api's 

{
  "email":"rakesh@gmail.com",
  "password":"Rakesh@123"
}

## 🚀 Features

### ✅ User Authentication
- Register/Login via email and password
- JWT-based secure session management
- All APIs are scoped to the authenticated shopkeeper

### 👥 Customer Management
- Add, edit, delete customers
- Fields: name, phone, address, trust score, credit limit

### 💳 Loan Management
- Create credit sales linked to a customer
- Track loan amount, issue & due date, repayment frequency, and optional interest
- Filter loans by status: pending, paid, overdue

### 💵 Repayment Tracking
- Record partial or full repayments
- Auto-update remaining balance
- View full repayment history per loan

### 📊 Summary & Alerts
- `/summary`: Total loaned, total collected, overdue amount, average repayment time


### 📄 PDF Receipt Generator
- Generate a professional PDF receipt for any repayment
- Receipt includes shopkeeper details, customer info, item description, loan and repayment info, and date
- Saved in the `Repayments/` folder
- Generated using Puppeteer and HTML template

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Puppeteer for PDF generation
- HTML/CSS for receipt template



API's 
http://localhost:3000/register   --- To register user mean ShopKeeper 
http://localhost:3000/login 
http://localhost:3000/logout 


http://localhost:3000/customer    -- To create customer who is taking the loan from shopkeeper  
http://localhost:3000/getallcustomers  -- To get all the customers 
http://localhost:3000/customer/6816605216054dece72841ea        -- edit customer
http://localhost:3000/customer/6816605216054dece72841ea         -- delete customer 



http://localhost:3000/customer/loan    ---    create Loan  approvall 
http://localhost:3000/customer/loan/68174daf41b2ccab0d8b58d6      --- loan detials  GET
http://localhost:3000/coustomer/loan/repayment/68174daf41b2ccab0d8b58d6     --- loan repayment 

http://localhost:3000/loan/repayments/      TO get all the loans given by the shopkeeper



http://localhost:3000/summary      -- To get summary of the loans 





