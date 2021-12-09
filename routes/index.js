const { Router, request, response } = require('express');

const router = Router();

router.get('/healtchheck', (req = request, res = response, next) => {
    res.json({
        status: 'UP!',
    })
});


module.exports = {
    router
};