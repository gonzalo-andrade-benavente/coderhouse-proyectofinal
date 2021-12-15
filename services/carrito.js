const fs = require('fs');
const Carrito = require("../models/Carrito");
const { findProductById } = require('../services/productos');

const pathFile = process.env.PATH_CARRITO;
const carritos = [];

const connectDBCart = async () => {
    try {
        const file = await fs.promises.readFile(pathFile, 'utf-8');
        const cartFile = JSON.parse(file);
        cartFile.forEach(cart => carritos.push(cart));

    } catch (err) {
        console.log('[error service.connectFIle method]', err);
    }
}

const createEmptyCart = async () => {
    const carrito = new Carrito();
    carritos.push(carrito);
    await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
    return carrito;
}

const addProductCart = async (id, id_prod) => {

    const indexCart = carritos.findIndex(cart => cart.id === id);
    let carrito;

    if (indexCart > -1) {
        const producto = findProductById(id_prod);
        carritos[indexCart].productos.push(producto);
        carrito = carritos[indexCart];
        await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
    }

    return carrito;

}

const getProductsById = (id) => {
    const carrito = carritos.find( cart => cart.id === id);
    return carrito.productos;
}

module.exports = {
    addProductCart
    , connectDBCart
    , createEmptyCart
    , getProductsById
}