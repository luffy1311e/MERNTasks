const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        // Crear un nuevo proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Revisar si el proyecto actual pertenece al usuairo autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs: 'No Autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);

        // Guardamos la Tarea
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Crear un nuevo proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Revisar si el proyecto actual pertenece al usuairo autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs: 'No Autorizado'});
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Actualiza un proyecto
exports.actualizarTarea = async (req, res) => {
    try{
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({mgs: 'No existe esa tarea'});
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuairo autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs: 'No Autorizado'});
        }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Actualizar la Tarea
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.json({tarea});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}

// Elimina una Tarea
exports.eliminarTarea = async (req, res) => {
    try{
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({mgs: 'No existe esa tarea'});
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuairo autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs: 'No Autorizado'});
        }

        // Eliminar 
        await Tarea.findOneAndRemove({ _id: req.params.id });

        res.json({msg: 'Tarea Eliminada'});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}