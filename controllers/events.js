const { response } = require('express');
const Evento = require('../models/Evento');



const getEventos = async (req, res = response) =>{

    const eventos = await Evento.find()
                                .populate('user', 'name');
    res.status(200).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) =>{

    const evento = new Evento( req.body );

    try { 
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            msg: eventoGuardado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })
    }
    
}
const actualizarEvento = async (req, res = response) =>{

    const eventoId = req.params.id;
    const uid = req.uid;
  
    
    try {
        const eventoToUpdate = await Evento.findById( eventoId );

        if(!eventoToUpdate){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if(eventoToUpdate.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
             ...req.body,
             user: uid
             }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        res.status(201).json({
            ok: true,
            evento: eventoActualizado            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })
        
    }
  
}

const eliminarEvento = async (req, res = response) =>{

    const { id } = req.params;
    const uid = req.uid;

    try {
        const eventToDelete = await Evento.findById( id );

        if(!eventToDelete){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }
        if(eventToDelete.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

             
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })        
    }
    
    await Evento.findByIdAndDelete(id);

    res.status(200).json({
        ok: true,
        msg: 'Evento eliminado'
    })
}

module.exports = {
    getEventos, 
    crearEvento, 
    actualizarEvento, 
    eliminarEvento
}