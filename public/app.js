const taxForm = document.getElementById('tax-form');
const paymentForm = document.getElementById('payment-form');
const taxResult = document.getElementById('tax-result');
const paymentResult = document.getElementById('payment-result');
const paymentsTableBody = document.getElementById('payments-table-body');

async function loadPayments() {
  try {
    const response = await fetch('/api/payments');
    const payments = await response.json();

    if (!payments.length) {
      paymentsTableBody.innerHTML = '<tr><td colspan="6">No payment records yet.</td></tr>';
      return;
    }

    paymentsTableBody.innerHTML = payments
      .slice()
      .reverse()
      .map(
        (payment) => `
          <tr>
            <td>${payment.id}</td>
            <td>${payment.taxpayerName}</td>
            <td>$${Number(payment.annualIncome).toLocaleString()}</td>
            <td>$${Number(payment.amount).toLocaleString()}</td>
            <td>${payment.paymentMethod}</td>
            <td>${new Date(payment.submittedAt).toLocaleString()}</td>
          </tr>
        `
      )
      .join('');
  } catch (error) {
    paymentsTableBody.innerHTML = '<tr><td colspan="6">Unable to load payment records.</td></tr>';
  }
}

taxForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    taxpayerName: document.getElementById('taxpayerName').value,
    annualIncome: document.getElementById('annualIncome').value,
    deductions: document.getElementById('deductions').value,
    filingStatus: document.getElementById('filingStatus').value
  };

  try {
    const response = await fetch('/api/tax/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    taxResult.innerHTML = `
      <h3>Tax Summary</h3>
      <p><strong>Taxpayer:</strong> ${result.taxpayerName}</p>
      <p><strong>Annual income:</strong> $${Number(result.annualIncome).toLocaleString()}</p>
      <p><strong>Deductions:</strong> $${Number(result.deductions).toLocaleString()}</p>
      <p><strong>Taxable income:</strong> $${Number(result.taxableIncome).toLocaleString()}</p>
      <p><strong>Estimated tax due:</strong> $${Number(result.taxDue).toLocaleString()}</p>
      <p><strong>Net income after tax:</strong> $${Number(result.netIncome).toLocaleString()}</p>
    `;
  } catch (error) {
    taxResult.innerHTML = '<h3>Tax Summary</h3><p>Unable to calculate tax right now.</p>';
  }
});

paymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    taxpayerName: document.getElementById('paymentTaxpayerName').value,
    annualIncome: document.getElementById('paymentAnnualIncome').value,
    amount: document.getElementById('amount').value,
    paymentMethod: document.getElementById('paymentMethod').value,
    filingStatus: document.getElementById('paymentFilingStatus').value
  };

  try {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    paymentResult.innerHTML = `
      <h3>Payment Status</h3>
      <p><strong>Receipt:</strong> ${result.id}</p>
      <p><strong>Taxpayer:</strong> ${result.taxpayerName}</p>
      <p><strong>Amount paid:</strong> $${Number(result.amount).toLocaleString()}</p>
      <p><strong>Payment method:</strong> ${result.paymentMethod}</p>
    `;

    loadPayments();
  } catch (error) {
    paymentResult.innerHTML = '<h3>Payment Status</h3><p>Unable to process the payment.</p>';
  }
});

loadPayments();
