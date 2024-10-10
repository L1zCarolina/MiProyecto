/// CONTROLADORES DEL MODULO ///

// Campos de la tabla libros
// id_libro
// titulo
// autor
// resumen
// imagen
// completado
// id_genero
// fecha_creacion

const db = require("../db/db");

//// METODO GET  /////

// Para todos los libros
const allBooks = (req, res) => {
    const sql = "SELECT * FROM libros";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un libro
const showBook = (req, res) => {
    const {id_libro} = req.params;
    const sql = "SELECT * FROM libros WHERE id_libro = ?";
    db.query(sql,[id_libro], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el libro buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posición cero si existe.
    }); 
};

//// METODO POST  ////
const storeBook = (req, res) => {
    const {titulo, autor, resumen, imagen, completado, id_genero} = req.body;
    const sql = "INSERT INTO libros (titulo, autor, resumen, imagen, completado, id_genero) VALUES (?,?,?,?,?,?)";
    db.query(sql,[titulo, autor, resumen, imagen, completado, id_genero], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
        }
        const libro = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(libro); // muestra creado con éxito el elemento
    });     
};

//// METODO PUT  ////
const updateBook = (req, res) => {
    const {id_libro} = req.params;
    const {titulo, autor, resumen, imagen, completado, id_genero} = req.body;
    const sql ="UPDATE libros SET titulo = ?, autor = ?, resumen = ?, imagen = ?, completado = ?, id_genero = ? WHERE id_libro = ?";
    db.query(sql,[titulo, autor, resumen, imagen, completado, id_genero, id_libro], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El libro a modificar no existe"});
        };
        
        const libro = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(libro); // mostrar el elemento que existe
    });     
};

//// METODO DELETE ////
const destroyBook = (req, res) => {
    const {id_libro} = req.params;
    const sql = "DELETE FROM libros WHERE id_libro = ?";
    db.query(sql,[id_libro], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El libro a borrar no existe"});
        };
        res.json({mensaje : "Libro Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allBooks,
    showBook,
    storeBook,
    updateBook,
    destroyBook
};