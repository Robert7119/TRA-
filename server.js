const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const paymentRecords = [];

function calculateTax(annualIncome, deductions, filingStatus) {
  const income = Number(annualIncome) || 0;
  const deductionAmount = Number(deductions) || 0;
  const taxableIncome = Math.max(0, income - deductionAmount);

  const brackets = {
    single: [
      { limit: 12000, rate: 0.1 },
      { limit: 40000, rate: 0.15 },
      { limit: 90000, rate: 0.2 },
      { limit: Infinity, rate: 0.25 }
    ],
    married: [
      { limit: 24000, rate: 0.1 },
      { limit: 80000, rate: 0.15 },
      { limit: 180000, rate: 0.2 },
      { limit: Infinity, rate: 0.25 }
    ],
    headOfHousehold: [
      { limit: 18000, rate: 0.1 },
      { limit: 60000, rate: 0.15 },
      { limit: 120000, rate: 0.2 },
      { limit: Infinity, rate: 0.25 }
    ]
  };

  const selectedBrackets = brackets[filingStatus] || brackets.single;
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of selectedBrackets) {
    const upperLimit = bracket.limit;
    const slice = Math.min(taxableIncome, upperLimit) - previousLimit;

    if (slice > 0) {
      tax += slice * bracket.rate;
    }

    previousLimit = upperLimit;

    if (taxableIncome <= upperLimit) {
      break;
    }
  }

  return Number(tax.toFixed(2));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Government tax system is running.' });
});

app.post('/api/tax/estimate', (req, res) => {
  const { annualIncome, deductions, filingStatus, taxpayerName } = req.body;

  const income = Number(annualIncome) || 0;
  const deductionAmount = Number(deductions) || 0;
  const taxDue = calculateTax(income, deductionAmount, filingStatus);
  const taxableIncome = Math.max(0, income - deductionAmount);
  const netIncome = income - taxDue;

  res.json({
    taxpayerName: taxpayerName || 'Unknown Taxpayer',
    annualIncome: income,
    deductions: deductionAmount,
    filingStatus: filingStatus || 'single',
    taxableIncome,
    taxDue,
    netIncome
  });
});

app.post('/api/payments', (req, res) => {
  const { taxpayerName, annualIncome, amount, paymentMethod, filingStatus } = req.body;

  const payment = {
    id: `TAX-${Date.now()}`,
    taxpayerName: taxpayerName || 'Unknown Taxpayer',
    annualIncome: Number(annualIncome) || 0,
    amount: Number(amount) || 0,
    paymentMethod: paymentMethod || 'Bank Transfer',
    filingStatus: filingStatus || 'single',
    submittedAt: new Date().toISOString()
  };

  paymentRecords.push(payment);
  res.status(201).json(payment);
});

app.get('/api/payments', (req, res) => {
  res.json(paymentRecords);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Government tax system running at http://localhost:${PORT}`);
});
