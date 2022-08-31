var MODELO = {};
var timeout_ = 60000;

/**
 * 
 * @param {*} connection 
 * @param {*} datos : Filtros
 */
MODELO.getAll = async function(connection, datos)
{
    return new Promise((resolve, reject) => {

        try {

            var sql = `SELECT * FROM usuarios WHERE eliminado=0 `;
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

            var sql = `SELECT * FROM usuarios WHERE id=? AND eliminado=0`;
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
MODELO.verificarExistencia = async function(connection, datos)
{
    return new Promise((resolve, reject) => {
        try {

            var sql = `SELECT * FROM usuarios WHERE email=? AND eliminado=0 `;    
            connection.query(
                {
                    sql: sql, 
                    values : [datos.email],
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
            var sql = ` INSERT INTO usuarios SET ? `;
            connection.query(
                sql, 
                {
                    username : datos.username,
                    email: datos.email,
                    contrasena	: datos.contrasena
                }, 
                async function (error, resultado) {
                    if (error) {
                        console.log("ERROR:: MODELO.crear", error);
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

            var sql = `UPDATE usuarios SET username=?, email=?, contrasena=? WHERE id=?`;
            connection.query(
                sql, 
                [
                    datos.username,
                    datos.email,
                    datos.contrasena,
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

            var sql = `UPDATE usuarios SET eliminado=1 WHERE id=?`;
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

            var sql = `DELETE FROM usuarios WHERE id =`+ datos.id;
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