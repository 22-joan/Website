<script>
async function cargarTransaccionesRecientes() {
    const tabla = document.getElementById("tabla-transacciones");
    tabla.innerHTML = ""; // Limpiar tabla

    try {
        // Obtener el último bloque
        const ultimoBloqueResponse = await fetch('https://mempool.space/api/blocks/tip/height');
        const ultimoBloqueHeight = await ultimoBloqueResponse.text();

        // Obtener info del bloque
        const bloqueResponse = await fetch(`https://mempool.space/api/block/${ultimoBloqueHeight}`);
        const bloque = await bloqueResponse.json();

        // Obtener transacciones del bloque
        const txids = bloque.tx;
        
        // Para cada txid, obtener detalles
        const promesasTx = txids.map(async (txid) => {
            const txResp = await fetch(`https://mempool.space/api/tx/${txid}`);
            return await txResp.json();
        });

        const transacciones = await Promise.all(promesasTx);

        // Filtrar por > 0.03 BTC
        const transaccionesFiltradas = transacciones.filter(tx => (tx.vout.reduce((sum, v) => sum + v.value, 0) / 1e8) > 0.03);

        if (transaccionesFiltradas.length === 0) {
            tabla.innerHTML = "<tr><td colspan='3'>No hay transacciones mayores a 0.03 BTC en los últimos minutos</td></tr>";
            return;
        }

        // Crear filas
        transaccionesFiltradas.forEach(tx => {
            const fila = document.createElement("tr");

            const txid = document.createElement("td");
            txid.textContent = tx.txid;

            const valor = document.createElement("td");
            const totalBTC = tx.vout.reduce((sum, v) => sum + v.value, 0) / 1e8;
            valor.textContent = totalBTC.toFixed(5) + " BTC";

            const fecha = document.createElement("td");
            const fechaObj = new Date(tx.status.block_time * 1000);
            fecha.textContent = fechaObj.toLocaleString();

            fila.appendChild(txid);
            fila.appendChild(valor);
            fila.appendChild(fecha);

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar transacciones:", error);
        tabla.innerHTML = "<tr><td colspan='3'>Error al obtener datos de la API</td></tr>";
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarTransaccionesRecientes);
</script>

