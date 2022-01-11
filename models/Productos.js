const { Schema, model } = require('mongoose');

const { productosSchema } = require('./schemas/productos');

const ProductosSchema = new Schema(productosSchema);

const ProductosModel = new model('Productos', ProductosSchema);

module.exports = {
    ProductosModel
}

