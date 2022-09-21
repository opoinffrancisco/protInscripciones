/**
 * PARA ADAPTAR EL MODELO 
 * Cambiar el nombre de la tabla
 * Modificar campos a gestionar en las funciones
 */
var MODELO = {};
var timeout_ = 60000;


/**
 * 
 * @param {*} connection 
 * @param {*} datos 
 */
 MODELO.getCountAll = async function(connection, datos)
 {
     return new Promise((resolve, reject) => {
 
         try {
 
             var sql = `SELECT COUNT(*) as total FROM persona WHERE eliminado=0 ORDER BY id desc LIMIT 1 OFFSET 0`;
             connection.query(
                 {
                     sql: sql, 
                     timeout: timeout_
                 }, 
                 async (error, resultado) => {
                     if (error) {
                         console.log("ERROR:: MODELO.getCountAll", error);
                         resolve(false);
                     } else{
                         resolve(resultado);
                     }
                 }
             );
         }catch (error) {
             console.log(error)
             resolve(false);
         }
     });
 }

/**
 * 
 * @param {*} connection 
 * @param {*} datos { por_pagina, siguiente }
 */
MODELO.getAll = async function(connection, datos)
{
    return new Promise((resolve, reject) => {

        try {
            let por_pagina = (datos.por_pagina)? datos.por_pagina : 5;
            let siguiente = (datos.siguiente)? datos.siguiente : 0;

            var sql = `SELECT * FROM persona WHERE eliminado=0 ORDER BY id desc LIMIT ${por_pagina} OFFSET ${siguiente}`;
            connection.query(
                {
                    sql: sql, 
                    timeout: timeout_
                }, 
                async (error, resultado) => {
                    if (error) {
                        console.log("ERROR:: MODELO.getAll", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );
        }catch (error) {
            console.log(error)
            resolve(false);
        }
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos { id }
 */
MODELO.get = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {

            var sql = `SELECT * FROM persona WHERE id=? AND eliminado=0`;
            connection.query(
                {
                    sql: sql, 
                    values: [datos.id],
                    timeout: timeout_
                }, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.get", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );



        }catch (error) {
            console.log(error)
            resolve(false)
        }
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos { nombre, dni }
 */
MODELO.filtrar = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {
            var sql = ` SELECT 
                            * 
                        FROM persona 
                        WHERE (nombre LIKE '%${datos.nombre}%' OR dni LIKE '%${datos.dni}%' ) AND eliminado=0  `;
            connection.query(
                {
                    sql: sql, 
                    timeout: timeout_
                }, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.filtrar", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );



        }catch (error) {
            console.log(error);
            resolve(false);
        }
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos { nombre, apellido, dni, id_tipo_persona, id_salon_clase, id_usuario  }
 */
MODELO.crear = async function(connection, datos)
{    
    return new Promise((resolve, reject) => {
        try {
            var sql = ` INSERT INTO persona SET ? `;
            connection.query(
                sql, 
                { 
                    nombre:datos.nombre, 
                    apellido:datos.apellido, 
                    dni:datos.dni, 
                    id_tipo_persona:datos.id_tipo_persona, 
                    id_salon_clase:datos.id_salon_clase, 
                    id_usuario:datos.id_usuario
                }, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.crear", error, resultado.insertId);
                        resolve(false);
                    } else{
                        //console.log("MODELO.crear - ID registrado: ", resultado.insertId);
                        resolve(resultado);
                    }
                }
            );


        }catch (error) {
            console.log(error)
            resolve(false);
        }                 
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos 
 */
MODELO.editar = async function(connection, datos)
{     
    return new Promise((resolve, reject) => {
        try {

            var sql =   `UPDATE persona SET 
                            nombre=?, 
                            apellido=?,
                            dni=?,
                            id_tipo_persona=?,
                            id_salon_clase=?
                        WHERE id=?`;
            connection.query(
                sql, 
                [
                    datos.nombre, 
                    datos.apellido, 
                    datos.dni, 
                    datos.id_tipo_persona, 
                    datos.id_salon_clase, 
                    datos.id 
                ], 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.editar", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );
        }catch (error) {
            console.log(error)
            resolve(false);
        }              
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos 
 */
MODELO.borradoLogico = async function(connection, datos)
{     
    return new Promise((resolve, reject) => {
        try {

            var sql = `UPDATE persona SET eliminado=1 WHERE id=?`;
            connection.query(
                sql, 
                [
                    datos.id
                ], 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.borradoLogico", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );
        }catch (error) {
            console.log(error)
            resolve(false);
        }       
    });
}

/**
 * 
 * @param {*} connection 
 * @param {*} datos 
 */
MODELO.borradoPermanente = async function(connection, datos)
{     
    return new Promise((resolve, reject) => {
        try {

            var sql = `DELETE FROM persona WHERE id =`+ datos.id;
            connection.query(
                sql, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.borradoPermanente", error);
                        resolve(false);
                    } else{
                        resolve(resultado);
                    }
                }
            );
        }catch (error) {
            console.log(error)
            resolve(false);
        }
    });
}

module.exports = MODELO;