import { NextFunction, Request, Response } from "express";
import { APP_ERROR_MESSAGE } from "@/src/utils/constants/app-error-message";
import { HTTP_STATUS_CODE } from "@/src/utils/constants/status-code";
import { ApplicationError } from "@/src/utils/errors";


export function globalErrorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    //Handle Error
    if (error instanceof ApplicationError) {
        const status = error.status;
        const message = error.message;
        const errors = error.errors;

        console.error(`$UserService - globalErrorHandler() method error: ${error}`);
        return res.status(status).json({message, error: errors})
    }

     // Unhandle Error
  console.error(`$UserService - globalErrorHandler() method unexpected error: ${error}`);
  res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({ message: APP_ERROR_MESSAGE.serverError });
}