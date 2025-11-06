async function cargarTransacciones() {
  const url = 'https://docs.google.com/spreadsheets/d/1mEB2nrolceJJD8Bu6HrvMNh19CTzYLlSXxbH8ckIjP4/pub?output=csv&gid=213429892';
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    const filas = text.split('\n').slice(1); // quitar encabezado

    const contenedor = document.getElementById('tabla-transacciones');
    contenedor.innerHTML = '';

    // Crear tabla
    const tabla = document.createElement('table');
    tabla.border = 1;
    const header = document.createElement('tr');
    header.innerHTML = '<th>TXID</th><th>Monto (BTC)</th><th>Hora</th><th>Tipo de transacción</th>';
    tabla.appendChild(header);

    filas.forEach(row => {
      const cols = row.split(',');
      if(cols.length < 4) return; // evitar filas vacías
      const hora = cols[0].trim();      // marca temporal
      const txid = cols[1].trim();      // nom
      const monto = parseFloat(cols[2]); // quantitat
      const tipo = cols[3].trim();      // tipus de transaccio

      if (monto > 0.03) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${txid}</td><td>${monto}</td><td>${hora}</td><td>${tipo}</td>`;
        tabla.appendChild(tr);
      }
    });

    contenedor.appendChild(tabla);

  } catch (error) {
    console.error('Error al cargar las transacciones:', error);
    const contenedor = document.getElementById('tabla-transacciones');
    contenedor.innerHTML = '<p>Error al cargar las transacciones.</p>';
  }
}

// Ejecutar al cargar la página
window.onload = cargarTransacciones;
