const {request, response} = require('express');
const jwt = require('jsonwebtoken');

const validaRol = (req = request, res = response, next) => {
    
    const { token } = req.headers;

    const role = (token === '123456789') ? 'admin' : 'user';

    const user = {
        rol: role 
    };

    if (user.rol !== 'admin') {
        return res.status(405).json({
            error: -1,
            descripcion: 'ruta no autorizada'
        });
    }

    next();
}

module.exports = validaRol;