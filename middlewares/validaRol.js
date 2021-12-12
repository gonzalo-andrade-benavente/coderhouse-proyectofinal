const {request, response} = require('express');

const validaRol = (req = request, res = response, next) => {
    const user = {
        rol: 'user'
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