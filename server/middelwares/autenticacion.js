const jwt = require('jsonwebtoken')


// ===========
//  Verificar token
// ==========

let verificaToken = (req, res, next) =>{


    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        if ( err ) {
            return res.status(401).json({
                ok:false,
                err:{
                    messages: "Token no valido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};


// ===========
//  Verificar admin role
// ==========

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario

        
        

        if( usuario.role !== 'ADMIN_ROLE'){
            return res.status(401).json({
                err:{
                    message: "No tiene los permisos necesarios para realizar esta acción"
                }
            })
        }

        next();
        
    };




module.exports = {
    verificaToken,
    verificaAdmin_Role
}