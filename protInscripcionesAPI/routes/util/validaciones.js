// validation
const Joi = require('joi');


const schemaUsuario = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    contrasena: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    contrasena: Joi.string().min(6).max(1024).required()
})

const schemaRecuperarContrasena = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
})

const schemaAnuncios = Joi.object({
    titulo: Joi.string().min(6).max(255).required(),
    descripcion: Joi.string().min(6).max(1024).required(),
    id: Joi.number().min(1).max(255),
    usuario_id: Joi.number().min(1).max(255)
})

module.exports = {
    schemaUsuario,
    schemaLogin,
    schemaRecuperarContrasena,
    schemaAnuncios
};