const {Router, request, response} = require('express');
const { v4: uuidv4 } = require('uuid');

const router = Router();

router.post('/', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/carrito',
    });
    
});

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