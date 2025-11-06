<!DOCTYPE html>
<html>
<head>
  <title>Transacciones BTC > 0.03</title>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; }
  </style>
</head>
<body>
  <h1>Transacciones BTC > 0.03</h1>
  <table id="btc-table">
    <thead>
      <tr>
        <th>TxID</th>
        <th>Monto (BTC)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    async function fetchTransactions() {
      const response = await fetch('https://mempool.space/api/mempool/recent');
      const data = await response.json();
      const tbody = document.querySelector('#btc-table tbody');
      tbody.innerHTML = '';

      data.forEach(tx => {
        const valueBTC = tx.vout_sum / 1e8; // convertir sats a BTC
        if (valueBTC > 0.03) {
          const row = `<tr>
            <td>${tx.txid}</td>
            <td>${valueBTC.toFixed(5)}</td>
          </tr>`;
          tbody.innerHTML += row;
        }
      });
    }

    fetchTransactions();
    setInterval(fetchTransactions, 30000); // actualizar cada 30s
  </script>
</body>
</html>
