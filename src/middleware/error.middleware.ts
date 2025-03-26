import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.response) {
    // Adobe API error
    return res.status(error.response.status).json({
      error: error.response.data || 'Adobe API Error',
      status: error.response.status
    });
  }

  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Could not connect to Adobe API'
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong'
  });
};