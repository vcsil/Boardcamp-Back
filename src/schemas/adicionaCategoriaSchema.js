import joi from "joi";

const adicionaCategoriaSchema = joi.object({
    name: joi.string().required(),
});

export default adicionaCategoriaSchema;
