// validation
const Joi = require('joi');

/**
 * Parametros
 * @pagina {number}
 * @por_pagina {number}
 */
const schemaPaginacion = Joi.object({
    pagina: Joi.string().min(6).max(255).required(),
    por_pagina: Joi.string().min(6).max(255).required()
})

/**
 * Parametros
 * @username {string}
 * @email {string}
 * @contrasena {string}
 */
const schemaUsuario = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    contrasena: Joi.string().min(6).max(1024).required()
})

/**
 * Parametros
 * @email {string}
 * @contrasena {string}
 */
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    contrasena: Joi.string().min(6).max(1024).required()
})

/**
 * Parametros
 * @email {string}
 */
const schemaRecuperarContrasena = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
})

/**
 * Parametros
 * @id {number}
 * @nombre {string}
 * @capacidad_personas {number}
 */
const schemaSalonClase = Joi.object({
    id: Joi.number().min(1).max(255).required(),
    nombre: Joi.string().min(6).max(255).required(),
    capacidad_personas: Joi.number().min(1).max(255).required(),
})

/**
 * Parametros
 * @id {number}
 * @nombre {string}
 * @descripcion {string}
 * @direccion {string}
 * @fecha_fundo {string}
 * @matricula_alumnos {number}
 */
 const schemaEscuela = Joi.object({
    id: Joi.number().min(1).max(255).required(),
    nombre: Joi.string().min(10).max(255).required(),
    descripcion: Joi.string().min(10).max(255).required(),
    direccion: Joi.string().min(10).max(255).required(),
    fecha_fundo: Joi.string().min(10).max(255).required(),
    capacidad_personas: Joi.number().min(1).max(255).required(),
})

/**
 * Parametros
 * @id {number} : se pasara un 0 pero no se guardara
 * @nombre {string}
 * @apellido {string}
 * @dni {string}
 * @id_tipo_persona {number}
 * @id_salon_clase {number}
 */
 const schemaPersona = Joi.object({
    id: Joi.number().min(1).max(255).required(),
    nombre: Joi.string().min(2).max(255).required(),
    apellido: Joi.string().min(2).max(255).required(),
    dni: Joi.string().min(10).max(255).required(),
    id_tipo_persona: Joi.number().min(1).max(255).required(),
    id_salon_clase: Joi.number().min(1).max(255).required(),
    id_usuario: Joi.number().min(1).max(255),
})

/**
 * Parametros
 * @id {number}
 * @nombre {string}
 * @descripcion {string}
 */
 const schemaTipoPersona = Joi.object({
    id: Joi.number().min(1).max(255).required(),
    nombre: Joi.string().min(2).max(255).required(),
    descripcion: Joi.string().min(10).max(255).required()
})

/**
 * Parametros
 * @id {number}
 * @nombre {string}
 * @descripcion {string}
 */
 const schemaTipoUsuario = Joi.object({
    id: Joi.number().min(1).max(255).required(),
    nombre: Joi.string().min(2).max(255).required(),
    descripcion: Joi.string().min(10).max(255).required()
})

module.exports = {
    schemaPaginacion,
    schemaEscuela,
    schemaPersona,
    schemaTipoPersona,
    schemaTipoUsuario,
    schemaSalonClase,
    schemaUsuario,
    schemaLogin,
    schemaRecuperarContrasena
};