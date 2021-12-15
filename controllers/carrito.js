const {request, response} = require('express');
const { addProductCart, createEmptyCart, deleteCartById ,getProductsById } = require('../services/carrito');


const postCarrito = async (req = request, res = response, next) => {
    
    const carrito = await createEmptyCart();
    
    res.send({ 
        id: carrito.id 
    });
}

const postCarritoProducto = async (req = request, res = response, next) => {

    const { id } = req.params;
    const { id_prod } = req.body;

    const carrito = await addProductCart(id, id_prod);

    if (carrito === undefined) {
        return res.status(404).json({
            error: -1,
            descripcion: `El carrito con ${id} no existe.`
        })
    }

    res.send(carrito);
}

const getCarritoProductos = (req = request, res = response, next) => {
    const { id } = req.params;
    const productos = getProductsById(id);

    if (productos === undefined) {
        res.status(404).json({
            error: -1,
            descripcion: `El carrito con ${id} no existe.`
        });
    }

    res.send(productos);
}

const deleteCarritoById = async (req = request, res = response, next) => {
    const { id } = req.params;
    const index = await deleteCartById(id);
    if (index === -1) {
        return res.status(404).json({
            error: -1,
            descripcion: `El carrito con ${id} no existe.`
        });
    }
    res.send({id});
}

module.exports = {
    getCarritoProductos
    , deleteCarritoById
    , postCarrito
    , postCarritoProducto

}