//*Rutas de usuarios: host + api/auth

const { Router} = require('express');
const router = Router();
const { check } = require('express-validator');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar_jwt');



router.post(
    '/new',
    [//Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'No es un email válido').isEmail(),
        check('password', 'El password debe de ser de mínimo 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [//Middlewares
        check('email', 'No es un email válido').isEmail(),
        check('password', 'El password debe de ser de mínimo 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);


module.exports = router;