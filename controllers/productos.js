const {request, response} = require('express');
const { v4: uuidv4 } = require('uuid');

const Producto = require('../models/Producto');

const postProduct = (req = request, res = response, next) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    
    const producto = new Producto(uuidv4(), nombre, descripcion, codigo, foto, precio, stock);

    res.json({
        msg: '/api/productos',
        producto
    });
}

module.exports = {
    postProduct
}