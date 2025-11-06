const tableBody = document.querySelector("#txTable tbody");

// Función para convertir satoshis a BTC
function satToBTC(sat) {
    return sat / 100000000;
}

// Función para mostrar transacciones
async function loadTransactions() {
    try {
        // Obtenemos los últimos 10 bloques
        const latestBlock = await fetch("https://blockstream.info/api/blocks/tip/height")
            .then(res => res.text());

        const blockData = await fetch(`https://blockstream.info/api/block-height/${latestBlock}`)
            .then(res => res.json());

        // Obtenemos las transacciones del bloque
        const txs = await fetch(`https://blockstream.info/api/block/${blockData.id}/txs`)
            .then(res => res.json());

        tableBody.innerHTML = ""; // Limpiar tabla

        txs.forEach(tx => {
            let totalBTC = tx.vout.reduce((sum, v) => sum + v.value, 0) / 100000000;

            // Filtrar transacciones > 0.03 BTC
            if(totalBTC > 0.03){
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${tx.txid}</td>
                    <td>${totalBTC.toFixed(4)}</td>
                    <td>${new Date(tx.status.block_time * 1000).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            }
        });
    } catch (err) {
        console.error("Error al obtener transacciones:", err);
    }
}

// Actualizar cada 30 segundos
loadTransactions();
setInterval(loadTransactions, 30000);
