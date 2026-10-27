# 🍦 Ice Cream Godown - Inventory Management System

A web-based inventory management system designed to manage ice cream products and track stock movements efficiently. The system uses QR code scanning to simplify stock IN and OUT operations.

## 🚀 Features

- 📦 Product management
- 📷 QR code scanning for stock operations
- 📥 Stock IN management
- 📤 Stock OUT management
- 📊 Current stock tracking
- 📜 Stock transaction history
- 📧 Email notifications for stock movements
- 📲 Telegram group notifications for stock movements
- 👤 User and labour tracking
- 💻 Responsive user interface

## 🛠️ Technologies Used

### Backend
- Java
- Spring Boot
- Maven

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript

### Database
- MySQL

### Integrations
- QR Code Scanner
- Email Notifications
- Telegram Bot API

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Java JDK
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mousumi-rout/icecream-godown.git
cd icecream-godown
```

### 2. Configure the Database

Create a MySQL database named:

```sql
CREATE DATABASE icecream_godown;
```

Configure your database connection settings in `application.properties` using environment variables or your local configuration.

**Important:** Never upload database passwords, email credentials, or Telegram bot tokens to GitHub.

### 3. Run the Backend

Open a terminal in the backend project directory and run:

```bash
mvnw.cmd spring-boot:run
```

### 4. Run the Frontend

Open another terminal in the frontend directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔔 Stock Notifications

The system supports email and Telegram notifications for stock IN and stock OUT operations.

Notifications can include:
- Product name
- QR code
- Transaction type
- Quantity
- Previous stock
- Current stock
- User or labour name

## 🎯 Project Objective

The main objective of this project is to simplify ice cream inventory management, reduce manual stock-entry work, and improve stock tracking through QR code scanning and automated notifications.

## 👩‍💻 Author

**Mousumi Rout**

GitHub: [mousumi-rout](https://github.com/mousumi-rout)
