import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './app-error.js';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: { code: error.code, message: error.message, details: error.details },
      });
    }
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'Request tidak valid.', details: error.issues },
      });
    }
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number' &&
      error.statusCode < 500
    ) {
      return reply.status(error.statusCode).send({
        error: { code: 'VALIDATION_ERROR', message: 'Request tidak valid.', details: [] },
      });
    }
    request.log.error(error);
    return reply.status(500).send({
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server.', details: [] },
    });
  });
}
