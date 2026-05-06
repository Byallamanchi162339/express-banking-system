const express = require("express");
const fs = require("fs");
const router = express.Router();

const DATA_FILE = "data.json";

// Read data
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Create Account
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const data = readData();

  const accountNumber = Date.now().toString();
  const user = {
    accountNumber,
    name,
    email,
    password,
    balance: 1000,
    transactions: []
  };

  data.users.push(user);
  writeData(data);

  res.json({ message: "Account created!", accountNumber });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = readData();

  const user = data.users.find(
    u => u.email === email && u.password === password
  );

  if (user) res.json(user);
  else res.status(401).json({ message: "Invalid credentials" });
});

// Transfer Money
router.post("/transfer", (req, res) => {
  const { fromAcc, toAcc, amount } = req.body;
  const data = readData();

  const sender = data.users.find(u => u.accountNumber === fromAcc);
  const receiver = data.users.find(u => u.accountNumber === toAcc);

  if (!sender || !receiver) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  const transaction = {
    fromAcc,
    toAcc,
    amount,
    date: new Date()
  };

  sender.transactions.push(transaction); // Stack
  data.transactions.push(transaction);

  writeData(data);
  res.json({ message: "Transfer successful" });
});

module.exports = router;