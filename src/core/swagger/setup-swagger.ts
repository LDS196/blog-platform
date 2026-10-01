import { Express, Request, Response } from 'express';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Platform API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:5001' }],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
  },
  apis: ['src/**/*.swagger.yml'],
};

export function setupSwagger(app: Express) {
  const spec = swaggerJsdoc(options);

  app.use('/api/docs', swaggerUi.serve);
  app.get('/api/docs', swaggerUi.setup(spec));
  app.get('/api/docs-json', (_req: Request, res: Response) => {
    res.json(spec);
  });
}
