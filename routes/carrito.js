const { Router } = require('express');
const router = Router();

const { getCarritoProductos, postCarrito, postCarritoProducto, deleteCarritoById } = require('../controllers/carrito');

router.post('/', postCarrito);

router.post('/:id/productos', postCarritoProducto);

router.get('/:id/productos', getCarritoProductos);

router.delete('/:id', deleteCarritoById);

router.delete('/:id/productos/:id_prod', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/carrito/:id/productos/:id_prod',
    });
    
});


module.exports = router;