const express = require('express');
const mysql = require('mysql');
const path = require('path');
require('dotenv').config(); 

const server = express();
const PORT = 8000;

// 1. Middlewares (¡ESTO VA PRIMERO!)
server.use(express.json()); // Permite recibir datos JSON del frontend
server.use(express.static(path.join(__dirname, '../FRONTEND'))); // Da acceso a la carpeta de imágenes, CSS y JS

// 2. Conexión a la base de datos MySQL en XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sin contraseña por defecto en XAMPP
    database: 'mibarrio'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Base de datos MySQL conectada.');
});

// 3. Rutas para mostrar tus páginas HTML
server.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/HTML/login.html'));
});

server.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/HTML/registro.html'));
});

server.get('/panel', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/HTML/panel.html'));
});

// ==========================================
// 4. ENDPOINTS PARA GUARDAR DATOS EN MYSQL
// ==========================================

// Guardar Avisos (Tabla: reportes)
server.post('/api/reportes', (req, res) => {
    const { mensaje, etiqueta, usuario } = req.body;
    const query = "INSERT INTO reportes (usuario, etiqueta, mensaje) VALUES (?, ?, ?)";
    db.query(query, [usuario || 'Vecino Registrado', etiqueta || '📢 Aviso Ciudadano', mensaje], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Reporte guardado en MySQL" });
    });
});

// Guardar Propuestas (Tabla: propuestas)
server.post('/api/propuestas', (req, res) => {
    const { propuesta_titulo, propuesta_categoria, propuesta_desc } = req.body;
    const query = "INSERT INTO propuestas (propuesta_titulo, propuesta_categoria, propuesta_desc) VALUES (?, ?, ?)";
    db.query(query, [propuesta_titulo, propuesta_categoria || 'General', propuesta_desc], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Propuesta guardada en MySQL" });
    });
});

// Guardar Donaciones (Tabla: donaciones)
server.post('/api/donaciones', (req, res) => {
    const { donar_proyecto, donar_monto, usuario } = req.body;
    const query = "INSERT INTO donaciones (usuario, donar_proyecto, donar_monto) VALUES (?, ?, ?)";
    db.query(query, [usuario || 'Vecino Anonimo', donar_proyecto, donar_monto], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Donación guardada en MySQL" });
    });
});

// 5. Iniciar el servidor (¡ESTO VA AL FINAL!)
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
});
// Guardar múltiples reportes de los deslizadores (Impacto del Barrio)
server.post('/api/mediciones', (req, res) => {
    const { reportes } = req.body; 
    
    if (!reportes || reportes.length === 0) {
        return res.json({ success: false, error: "No hay reportes mayores a 0 para guardar." });
    }

    let procesados = 0;
    let errores = 0;

    reportes.forEach(rep => {
        const query = "INSERT INTO reportes (usuario, etiqueta, mensaje, ubicacion, cantidad) VALUES (?, ?, ?, ?, ?)";
        db.query(query, ['Vecino Registrado', rep.etiqueta, rep.mensaje, rep.ubicacion, rep.cantidad], (err) => {
            if (err) errores++;
            procesados++;
            
            // Cuando termine de procesar todos los elementos del arreglo:
            if (procesados === reportes.length) {
                if (errores > 0) {
                    res.status(500).json({ success: false, error: "Hubo errores al guardar algunos reportes." });
                } else {
                    res.json({ success: true, message: "¡Todos los reportes estructurados se guardaron en MySQL!" });
                }
            }
        });
    });
});