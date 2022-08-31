var MODELO = {};
var timeout_ = 60000;


/**
 * 
 * @param {*} connection 
 * @param {*} datos : Filtros
 */
 MODELO.getCountAll = async function(connection, datos)
 {
     return new Promise((resolve, reject) => {
 
         try {
 
             var sql = `SELECT COUNT(*) as total FROM anuncios WHERE eliminado=0 ORDER BY id desc LIMIT 1 OFFSET 0`;
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
 * @param {*} datos : Filtros
 */
MODELO.getAll = async function(connection, datos)
{
    return new Promise((resolve, reject) => {

        try {
            let por_pagina = (datos.por_pagina)? datos.por_pagina : 5;
            let siguiente = (datos.siguiente)? datos.siguiente : 0;

            var sql = `SELECT * FROM anuncios WHERE eliminado=0 ORDER BY id desc LIMIT ${por_pagina} OFFSET ${siguiente}`;
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
 * @param {*} datos 
 */
MODELO.get = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {

            var sql = `SELECT * FROM anuncios WHERE id=? AND eliminado=0`;
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
 * @param {*} datos 
 */
MODELO.filtrar = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {
            var sql = ` SELECT 
                            * 
                        FROM anuncios 
                        WHERE ( titulo LIKE '%${datos.titulo}%' OR descripcion LIKE '%${datos.descripcion}%' )
                            AND eliminado=0  `;
            
            connection.query(
                {
                    sql: sql, 
                    timeout: timeout_
                }, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.getFiltro", error);
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
 * @param {*} datos 
 */
MODELO.crear = async function(connection, datos)
{    
    return new Promise((resolve, reject) => {
        try {
            var sql = ` INSERT INTO anuncios SET ? `;
            connection.query(
                sql, 
                {
                    titulo: datos.titulo,
                    descripcion	: datos.descripcion
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

            var sql = `UPDATE anuncios SET 	titulo=?, descripcion=? WHERE id=? AND usuario_id=?`;
            connection.query(
                sql, 
                [
                    datos.titulo,
                    datos.descripcion,
                    datos.id,
                    datos.usuario_id
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

            var sql = `UPDATE anuncios SET eliminado=1 WHERE id=?`;
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

            var sql = `DELETE FROM anuncios WHERE id =`+ datos.id;
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