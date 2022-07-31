import joi from "joi";

const listaCategoriasSchema = joi.object({
    name: joi.string().required(),
});

export default listaCategoriasSchema;
