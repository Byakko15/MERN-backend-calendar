const express = require('express');
require('dotenv').config();
const { dbConection } = require('./db/config');
const cors  = require('cors')

//*Crear el servidor de express
const app = express();
exports.app = app;

//*Base de datos
dbConection();

//*Configuración CORS
app.use(cors());

//*Directorio público
app.use(express.static('public'));

//* Lectura y parseo del body
app.use(express.json());

//*Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//*Escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})