import { ErrorRequestHandler, RequestHandler } from 'express';
import { __is_prod__ } from '../utils/constants';

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: __is_prod__ ? null : err.stack
  });
};
