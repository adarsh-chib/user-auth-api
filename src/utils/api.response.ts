import { Response } from "express";

export const sendResponse = <T>(
    res : Response,
    statusCode : number,
    message : string,
    data?: T
) =>{
    return res.status(statusCode).json({
        status : statusCode,
        message,
        data
    });
};
