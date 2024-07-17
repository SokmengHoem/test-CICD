import Joi from "joi";

const productJoiSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().greater(0).required()
  });
export default productJoiSchema;