const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('.'));

app.get('/generate', (req, res) => {
  const number = req.query.number;
  if (!number) return res.status(400).json({ error: 'Phone number is required' });

  // Mock pairing code for testing
  const pairingCode = `ABC-${Math.floor(Math.random() * 100000)}-XYZ`;

  res.json({ pairingCode });
});

app.listen(PORT, () => {
  console.log(`Xason XtarmD Session Scanner running on http://localhost:${PORT}`);
});
