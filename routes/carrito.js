const { Router } = require('express');
const router = Router();

const { postCarrito, postCarritoProducto } = require('../controllers/carrito');

router.post('/', postCarrito);

router.post('/:id/productos', postCarritoProducto);

router.delete('/:id', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/carrito/:id',
    });
    
});


router.get('/:id/productos', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/carrito/:id/productos',
    });

});

router.delete('/:id/productos/:id_prod', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/carrito/:id/productos/:id_prod',
    });
    
});


module.exports = router;