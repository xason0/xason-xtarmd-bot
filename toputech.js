const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = process.cwd();
const PORT = process.env.PORT || 8000;

const qr = require('./qr.js');
const fs = require('fs');
const codeRouter = require('./code'); // <-- Criss pairing system

// Optional: Set max listeners
require('events').EventEmitter.defaultMaxListeners = 500;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve your QR code logic if needed
app.use('/qr', qr);

// Serve your glowing pairing.html
app.use('/pair', async (req, res, next) => {
  res.sendFile(path + '/pair.html');
});

// Serve your home page
app.use('/', async (req, res, next) => {
  res.sendFile(path + '/index.html');
});

// Connect Criss pairing logic to this route
app.use('/pairing-code', codeRouter);

// Start server
app.listen(PORT, () => {
  console.log("Topu-Qr-Scanner is Live");
  console.log("Server running on http://localhost:" + PORT);
});

module.exports = app;
