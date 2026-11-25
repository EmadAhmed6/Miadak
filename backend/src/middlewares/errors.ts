import type { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({ message: err.message });
};

const sendError = (res: Response, statusCode: number, errorMessage: string) => {
  return res.status(statusCode).json({
    success: false,
    message: "Request failed",
    data: { message: errorMessage },
  });
};
const sendResponse = (
  res: Response,
  statusCode: number,
  message: string = "Successful Request",
  data: any,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export { notFound, errorHandler, sendError, sendResponse };
