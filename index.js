require('dotenv').config();
const express = require('express');
const { connectDB } = require('./services/productos');
const { connectDBCart } = require('./services/carrito');
const { router } = require('./routes/index');
const routerProductos = require('./routes/productos');
const routerCarrito = require('./routes/carrito');


const app = express();
const PORT = process.env.PORT || 8080;

//console.log(process.env.PATH_PRODUCTOS, process.env.PATH_CARRITO);
const connDB = async () => {
    await connectDB();
    await connectDBCart();
}

connDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("./public"));

// Routes
app.use('/api', router);
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

const server = app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});



module.exports = server;

