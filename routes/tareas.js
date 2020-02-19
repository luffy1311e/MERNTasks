const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea proyectos
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener todas las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTarea
)

// Actualizar Tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

// Eliminar un Proyecto
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router