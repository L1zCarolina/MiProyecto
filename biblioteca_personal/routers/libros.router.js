/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/libros.controller");

//// METODO GET  /////

// Para todos los libros
router.get('/', controller.allBooks);

// Para un libro
router.get('/:id_libro', controller.showBook);

//// METODO POST  ////
router.post('/', controller.storeBook);

//// METODO PUT  ////
router.put('/:id_libro', controller.updateBook);

//// METODO DELETE ////
router.delete('/:id_libro', controller.destroyBook);

// EXPORTAR ROUTERS
module.exports = router;