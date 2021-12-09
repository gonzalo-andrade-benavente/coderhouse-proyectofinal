const {Router, request, response} = require('express');
const router = Router();

const { postProduct} = require('../controllers/productos');

router.get('/:id', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/productos/:id',
    });

});

router.post('/', postProduct);

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