const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			res.status(500).json({
				ok: false,
				msg: "El correo ya existe",
			});
		}

		usuario = new Usuario(req.body);

        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();
        const token = await generarJWT(usuario.id, usuario.name)

		res.status(201).json({
			ok: true,
            uid: usuario.id,
			name: usuario.name,
            token
		});
	} catch (error) {
		console.log(error);
        res.status(500).send('Algo salió mal en la creación del usuario')
	}
};

const loginUsuario = async (req, res = response)=>{
    const { email, password } = req.body;   

    try {
        const usuario = await Usuario.findOne({email})
        if(!usuario){
           return res.status(400).send('El email no existe')
        }

        //Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if(!validPassword){
            return res.status(400).send('El password es incorrecto')
        }
        
        const token = await generarJWT(usuario.id, usuario.name)


        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token           
        })
    } catch (error) {
		console.log(error);
        res.status(500).send('Algo salió mal con el login del usuario')
	}
    
}

const revalidarToken = async (req, res = response)=>{
    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name)



    res.status(200).json({
        ok: true,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}

