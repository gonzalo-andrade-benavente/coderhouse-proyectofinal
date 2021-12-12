const {request, response} = require('express');
const { v4: uuidv4 } = require('uuid');

const Producto = require('../models/Producto');

const { saveProduct } = require('../services/productos');

const postProduct = async (req = request, res = response, next) => {
    
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    
    const producto = new Producto(uuidv4(), nombre, descripcion, codigo, foto, precio, stock);

    const id = await saveProduct(producto);

    res.json({
        id
    });
}

module.exports = {
    postProduct
}