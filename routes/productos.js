const {Router, request, response} = require('express');
const router = Router();

const { postProduct,getProduct } = require('../controllers/productos');
const validaRol  = require('../middlewares/validaRol');

router.get('/:id', getProduct);

router.post('/', [ validaRol ], postProduct);

router.put('/:id', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/productos/:id',
    });
    
});

router.delete('/:id', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/productos/:id',
    });
    
});


module.exports = router;