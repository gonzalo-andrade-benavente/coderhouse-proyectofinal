/*
const { v4: uuidv4 } = require('uuid');

class Carrito {
    constructor() {
        this.id = uuidv4();
        this.timestamp = Date.now();
        this.productos = [];
    }
}

module.exports = Carrito;
*/

const { Schema, model } = require('mongoose');

const { carritoSchema } = require('./schemas/carritos');

const CarritoSchema = new Schema(carritoSchema);

const CarritoModel = new model('Carritos', CarritoSchema);

module.exports = {
    CarritoModel
}
