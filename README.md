# 🛍️ Shopkeeper Credit Management Backend

This is a RESTful backend service that helps small business owners (like kirana stores, tailors, hardware shops, etc.) 
manage credit sales to customers. It allows shopkeepers to record loans (credit sales), track repayments, get payment reminders, 
and generate downloadable receipts — all through a secure, user-specific API system.

---

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







