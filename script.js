async function cargarTransacciones() {
    const url = 'https://docs.google.com/spreadsheets/d/1mEB2nrolceJJD8Bu6HrvMNh19CTzYLlSXxbH8ckIjP4/pub?output=csv&gid=213429892';
    
    try {
        const response = await fetch(url);
        const text = await response.text();
        const filas = text.split('\n').slice(1); // quitar encabezado

        const tbody = document.querySelector('#txTable tbody');
        tbody.innerHTML = ''; // limpiar tabla

        filas.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 4) return; // evitar filas vacías
            const hora = cols[0].trim();      // marca temporal
            const txid = cols[1].trim();      // nom
            const monto = cols[2].trim();     // quantitat
            const tipo = cols[3].trim();      // tipus de transaccio

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${txid}</td><td>${monto}</td><td>${hora}</td>`;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error al cargar las transacciones:', error);
    }
}

// Ejecutar al cargar la página
window.onload = cargarTransacciones;
