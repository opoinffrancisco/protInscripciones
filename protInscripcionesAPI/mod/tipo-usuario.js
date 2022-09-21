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
 
             var sql = `SELECT COUNT(*) as total FROM tipo_usuario WHERE eliminado=0 ORDER BY id desc LIMIT 1 OFFSET 0`;
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

            var sql = `SELECT * FROM tipo_usuario WHERE eliminado=0 ORDER BY id desc LIMIT ${por_pagina} OFFSET ${siguiente}`;
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

            var sql = `SELECT * FROM tipo_usuario WHERE id=? AND eliminado=0`;
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
 * @param {*} datos { nombre }
 */
MODELO.filtrar = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {
            var sql = ` SELECT 
                            * 
                        FROM tipo_usuario 
                        WHERE nombre LIKE '%${datos.nombre}%' AND eliminado=0  `;
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
 * @param {*} datos { nombre, descripcion }
 * @param {*} usuarioSesion
 */
MODELO.crear = async function(connection, datos, usuarioSesion)
{    
    return new Promise((resolve, reject) => {
        try {
            var sql = ` INSERT INTO tipo_usuario SET ? `;
            connection.query(
                sql, 
                { 
                    nombre:datos.nombre, 
                    descripcion:datos.descripcion,
                    id_ingreso_sistema: usuarioSesion.id
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

            var sql =   `UPDATE tipo_usuario SET 
                            nombre=?,
                            descripcion=? 
                        WHERE id=?`;
            connection.query(
                sql, 
                [
                    datos.nombre, 
                    datos.descripcion, 
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

            var sql = `UPDATE tipo_usuario SET eliminado=1 WHERE id=?`;
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

            var sql = `DELETE FROM tipo_usuario WHERE id =`+ datos.id;
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