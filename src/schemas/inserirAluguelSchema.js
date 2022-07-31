import joi from "joi";

const inserirAluguelSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required(),
});

export default inserirAluguelSchema;
