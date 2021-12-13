const { Router } = require('express');

const { getProduct, deleteProduct, postProduct, putProduct  } = require('../controllers/productos');

const validaRol  = require('../middlewares/validaRol');

const router = Router();

router.get('/:id', getProduct);

router.post('/', [ validaRol ], postProduct);

router.put('/:id', [ validaRol ], putProduct);

router.delete('/:id', [ validaRol ], deleteProduct);

module.exports = router;