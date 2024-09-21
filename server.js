const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Cambia si usas un servidor remoto
    user: 'root', // Tu usuario de MySQL
    password: 'nueva_contrasena', // Tu contraseña de MySQL
    database: 'gestion_escolar'
});

// Conectar a MySQL
connection.connect(error => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para registrar estudiantes
app.post('/registrar-estudiante', (req, res) => {
    const { nombre, grado } = req.body;

    // Inserta el estudiante en la base de datos
    const query = 'INSERT INTO estudiantes (nombre, grado) VALUES (?, ?)';
    connection.query(query, [nombre, grado], (error, results) => {
        if (error) {
            console.error('Error al registrar estudiante:', error);
            return res.status(500).json({ message: 'Error al registrar estudiante', error });
        }
        res.json({ message: 'Estudiante registrado correctamente', id: results.insertId });
    });
});

// Ruta para obtener todos los estudiantes
app.get('/estudiantes', (req, res) => {
    const query = 'SELECT * FROM estudiantes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener estudiantes:', error);
            return res.status(500).json({ message: 'Error al obtener estudiantes', error });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
// Ruta para actualizar un estudiante
app.put('/actualizar-estudiante/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, grado } = req.body;

    const query = 'UPDATE estudiantes SET nombre = ?, grado = ? WHERE id = ?';
    connection.query(query, [nombre, grado, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar estudiante:', error);
            return res.status(500).json({ message: 'Error al actualizar estudiante', error });
        }
        res.json({ message: 'Estudiante actualizado correctamente' });
    });
});
// Ruta para eliminar un estudiante
app.delete('/eliminar-estudiante/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM estudiantes WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar estudiante:', error);
            return res.status(500).json({ message: 'Error al eliminar estudiante', error });
        }
        res.json({ message: 'Estudiante eliminado correctamente' });
    });
});
