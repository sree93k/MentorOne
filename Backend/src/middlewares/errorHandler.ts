import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(statusCode: number, message: string, error: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            error: err.error
        });
    }

    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal Server Error',
        error: err.message
    });
};