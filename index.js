require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const { config } = require('./config');
const { connectDB } = require('./services/productos');
const { connectDBCart } = require('./services/carrito');

const { router } = require('./routes/index');
const routerProductos = require('./routes/productos');
const routerCarrito = require('./routes/carrito');

const app = express();
require('./config/databaseMongoDB');
require('./config/databaseFilesystem');
const PORT = config.port;

// Middlewares
if ( config.dev !== 'production' ) {
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Routes
app.use('/api', router);
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

app.get('/*', (req, res) => {
    res.json({
        error: -2,
        descripcion: 'ruta incorrecta'
    });
});


const server = app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});



module.exports = server;

