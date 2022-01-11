const Joi = require('joi');

let timestamp = Joi.number();
let nombre = Joi.string();
let descripcion = Joi.string();
let codigo = Joi.string();
let foto = Joi.string();
let precio = Joi.number();
let stock = Joi.number();
let borrado = Joi.bool().required();

const productosSchema = {
    timestamp
    , nombre
    , descripcion
    , codigo
    , foto
    , precio
    , stock
    , borrado

}

module.exports = {
    productosSchema
}