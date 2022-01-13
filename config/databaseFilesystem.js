const { config } = require('./index');
const { connectDB } = require('../services/productos');
const { connectDBCart } = require('../services/carrito');

if (config.database === 'FILESYSTEM') {

    (async () => {

        connectDB();
        connectDBCart();
        console.log('Filesystem connected!');
        
    })();

}

