const { Router } = require('express');
const router = Router();

const { getCarritoProductos, postCarrito, postCarritoProducto, deleteCarritoById, deleteCarritoProductoById} = require('../controllers/carrito');

router.post('/', postCarrito);

router.post('/:id/productos', postCarritoProducto);

router.get('/:id/productos', getCarritoProductos);

router.delete('/:id', deleteCarritoById);

router.delete('/:id/productos/:id_prod', deleteCarritoProductoById);

module.exports = router;