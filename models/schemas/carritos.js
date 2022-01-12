const Joi = require('joi');
const { productosSchema } = require('./productos');

let timestamp = Joi.number();
let productos = Joi.array();
//let productos = Joi.array().items(productosSchema);

const carritoSchema = {
    timestamp
    , productos: [productosSchema]
}

module.exports = {
    carritoSchema
}