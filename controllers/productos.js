const {request, response} = require('express');
const { v4: uuidv4 } = require('uuid');

const Producto = require('../models/Producto');

const { deleteProductById, findProductById, saveProduct, updateProductById } = require('../services/productos');

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

    let respuesta;

    if ( id !== undefined ) {
        const product = await findProductById(id);
        if (product === null) {
            return res.status(404).json({
                error: -1,
                descripcion: `El producto con ${id} no existe.`
            });
        }

        respuesta = product;
    } else {
        respuesta = await findProductById();
    }

    
    
    res.json(respuesta);
}

const putProduct = async (req = request, res = response, next) => {
    const { id } = req.params;
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const product = await updateProductById(id, { nombre, descripcion, codigo, foto, precio, stock });

    if (product === null) {
        return res.status(404).json({
            error: -1,
            descripcion: `El producto con ${id} no existe.`
        })
    }
    
    res.json(product);
}

const deleteProduct = async (req = request, res = response, next) => {
    const { id } = req.params;
    const product = await deleteProductById(id);

    if (product === null) {
        return res.status(404).json({
            error: -1,
            descripcion: `El producto con ${id} no existe.`
        })
    }
    
    res.json(product);
}

module.exports = {
    deleteProduct
    , getProduct
    , postProduct
    , putProduct
}