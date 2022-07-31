import joi from "joi";

const insereClienteSchema = joi.object({
    name: joi.string().required(),
    phone: joi
        .string()
        .pattern(/^[0-9]{10,11}$/) // Formado por 10 a 11 números
        .messages({
            "string.pattern.base": `Número de celular deve ter entre 10 a 11 dígitos`,
        })
        .required(),
    cpf: joi
        .string()
        .pattern(/^[0-9]{11}$/) // Formado por 11 números
        .messages({
            "string.pattern.base": `CPF deve ter 11 dígitos`,
        })
        .required(),
    birthday: joi.date().required(),
});

export default insereClienteSchema;
