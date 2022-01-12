const fs = require('fs');

const carritos = [];
const { CarritoModel } = require('../models/Carrito');
const { config } = require('../config/index');
const { findProductById } = require('../services/productos');
const pathFile = process.env.PATH_CARRITO;

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
    /*
    const carrito = new Carrito();
    carritos.push(carrito);
    await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
    return carrito;
    */
    let cart;

    try {
        cart = await CarritoModel.create({
            timestamp: Date.now()
        });
    } catch (err) {
        console.log(err);
    }

    return cart;

}

const addProductCart = async (id, id_prod) => {

    /*
    const indexCart = carritos.findIndex(cart => cart.id === id);
    let carrito;

    if (indexCart > -1) {
        const producto = findProductById(id_prod);
        carritos[indexCart].productos.push(producto);
        carrito = carritos[indexCart];
        await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
    }

    return carrito;
    */
    let cart;
    let prd;

    try {

        cart = await CarritoModel.findById(id);

        if (cart !== null) {
            prd = await findProductById(id_prod);
            // Controlar si el producto existe o no.
            cart = await CarritoModel.findById(id);
            cart.productos = [...cart.productos, prd];
            //cart.productos.push(prd);
            await cart.save();
        }

    } catch(err) {
        console.log(err);
    }

    return cart;

}

const getProductsById = (id) => {
    const carrito = carritos.find( cart => cart.id === id);
    if (carrito === undefined) {
        return undefined;
    }
    return carrito.productos;
}

const deleteCartById = async (id) => {
    let indexCart = -1;

    if (carritos.length > 0) {
        indexCart = carritos.findIndex(cart => cart.id === id);
    }

    if (indexCart > -1) {
        carritos[indexCart].id = '-1';
        await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
    }
    return indexCart;
}

const deleteCartProductById = async (id, id_prod) => {
    let indexCart = -1;
    const product = {
        id_prod,
        borrado: false
    }

    if (carritos.length > 0) {
        indexCart = carritos.findIndex(cart => cart.id === id);
    }

    if (indexCart > -1) {
        const tmpProducts = carritos[indexCart].productos.filter(prd => prd.id !== id_prod);
        carritos[indexCart].productos = tmpProducts;
        product.borrado = true;
        await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2)); 
    }

    return product;
}

module.exports = {
    addProductCart
    , connectDBCart
    , createEmptyCart
    , getProductsById
    , deleteCartById
    , deleteCartProductById
}