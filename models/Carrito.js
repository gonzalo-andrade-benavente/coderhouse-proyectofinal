const { v4: uuidv4 } = require('uuid');

class Carrito {
    constructor() {
        this.id = uuidv4();
        this.timestamp = Date.now();
        this.productos = [];
    }
}

module.exports = Carrito;