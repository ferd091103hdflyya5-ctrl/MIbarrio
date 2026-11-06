// ==========================================
// FUNCIÓN PARA PUBLICAR AVISOS EN EL MURO
// ==========================================
function publicarAvisoMuro() {
    const texto = document.getElementById('texto-reporte-libre').value;
    
    if (!texto.trim()) {
        alert("Escribe un mensaje antes de publicar.");
        return;
    }

    fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mensaje: texto,
            etiqueta: '📢 Aviso Ciudadano',
            usuario: 'Vecino Registrado'
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("¡Aviso guardado con éxito en la base de datos!");
            document.getElementById('texto-reporte-libre').value = ''; // Limpiar campo
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => console.error("Error al conectar con Node.js:", err));
}

// ==========================================
// FUNCIÓN PARA PUBLICAR PROPUESTAS
// ==========================================
function publicarPropuesta() {
    const titulo = document.getElementById('propuesta-titulo').value;
    const categoria = document.getElementById('propuesta-categoria').value;
    const desc = document.getElementById('propuesta-desc').value;

    if (!titulo.trim() || !desc.trim()) {
        alert("Por favor, completa el título y la descripción de la propuesta.");
        return;
    }

    fetch('/api/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            propuesta_titulo: titulo,
            propuesta_categoria: categoria || 'General',
            propuesta_desc: desc
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("¡Propuesta guardada correctamente en la base de datos!");
            document.getElementById('propuesta-titulo').value = ''; // Limpiar campos
            document.getElementById('propuesta-desc').value = '';
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => console.error("Error al conectar con Node.js:", err));
}
// ==========================================
// FUNCIÓN PARA ENVIAR LOS REPORTES ESTRUCTURADOS (Deslizadores)
// ==========================================
function enviarReportesEstructurados() {
    const reportes = [];

    // Función auxiliar para agregar al arreglo solo si la cantidad es mayor a 0
    const recolectar = (idRango, idUbi, etiqueta, textoRango) => {
        const rango = document.getElementById(idRango);
        const ubi = document.getElementById(idUbi);
        
        if (rango && ubi && parseInt(rango.value) > 0) {
            reportes.push({
                etiqueta: etiqueta,
                mensaje: `${textoRango}: ${rango.value} reportes en ${ubi.value}`,
                ubicacion: ubi.value,
                cantidad: parseInt(rango.value)
            });
        }
    };

    // Extraer datos de los IDs de tu HTML
    recolectar('range-fugas', 'ubi-fugas', '💧 Fuga de Agua', 'Fugas de agua');
    recolectar('range-basura', 'ubi-basura', '🗑️ Basura', 'Bolsas de basura');
    recolectar('range-lamparas', 'ubi-lamparas', '💡 Alumbrado', 'Lámparas fundidas');
    
    // Asumiendo que les pusiste estos IDs a los puntos 4 y 5 de tu HTML:
    recolectar('range-seguridad', 'ubi-seguridad', '🚨 Seguridad', 'Incidentes de seguridad');
    recolectar('range-animales', 'ubi-animales', '🐕 Animales', 'Animales perdidos/callejeros');

    if (reportes.length === 0) {
        alert("Mueve al menos un deslizador a 1 o más antes de enviar.");
        return;
    }

    fetch('/api/mediciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportes: reportes })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("¡Tus reportes de impacto se registraron en la base de datos!");
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => console.error("Error al conectar con Node.js:", err));
}