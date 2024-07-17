import { NextFunction, Request, Response } from "express";
import Joi from "joi";


const validateRequest = ( schema: Joi.ObjectSchema) => {
    return ( req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if(error) {
            const errors = error.details.map(detail => detail.message);

            return next(new Error(errors.toString()));
        }

        next();
    };
};

export default validateRequest;