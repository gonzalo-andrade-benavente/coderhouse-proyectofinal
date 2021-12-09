const {Router, request, response} = require('express');

const router = Router();

router.get('/:id', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/productos/:id',
    });

});

router.post('/', (req = request, res = response, next) => {
    
    res.json({
        msg: '/api/productos',
    });
    
});

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