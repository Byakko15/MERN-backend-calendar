//*Rutas de usuarios: host + api/events

const { Router} = require('express');
const router = Router();
const { validarJWT } = require('../middlewares/validar_jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');
const { isDate } = require('../helpers/isDate');

router.use(validarJWT);


router.get('/',
    // [
    //     check('title', 'El titulo es obligatorio').not().isEmpty(),
    //     validarCampos
    // ],
    getEventos);
router.post('/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatorio').custom(isDate),
        check('end', 'La fecha de finalización es obligatorio').custom(isDate),
        validarCampos
    ],  
    crearEvento);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);




module.exports = router;
