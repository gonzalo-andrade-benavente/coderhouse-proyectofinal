const {request, response} = require('express');
const { v4: uuidv4 } = require('uuid');

const Producto = require('../models/Producto');

const { saveProduct, findProductById } = require('../services/productos');

const postProduct = async (req = request, res = response, next) => {
    
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    
    const producto = new Producto(uuidv4(), nombre, descripcion, codigo, foto, precio, stock);

    const id = await saveProduct(producto);

    res.json({
        id
    });
}

const getProduct = async (req = request, res = response, next) => {

    const { id } = req.params;

    const product = await findProductById(id);

    if (product === undefined) {
        return res.status(404).json({
            error: -1,
            descripcion: `El producto con ${id} no existe.`
        })
    }
    
    res.json(product);
}

module.exports = {
    postProduct
    , getProduct
}