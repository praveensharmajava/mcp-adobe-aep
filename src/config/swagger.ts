export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Adobe Experience Platform API',
    version: '1.0.0',
    description: 'API documentation for Adobe Experience Platform integration'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/aep/schemas': {
      get: {
        summary: 'List all schemas',
        responses: {
          '200': {
            description: 'List of schemas'
          }
        }
      },
      post: {
        summary: 'Create a new schema',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'type', 'properties'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  properties: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Schema created successfully'
          }
        }
      }
    },
    '/api/aep/datasets': {
      get: {
        summary: 'List all datasets',
        responses: {
          '200': {
            description: 'List of datasets'
          }
        }
      },
      post: {
        summary: 'Create a new dataset',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'schemaRef'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  schemaRef: {
                    type: 'object',
                    required: ['id', 'contentType'],
                    properties: {
                      id: { type: 'string' },
                      contentType: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Dataset created successfully'
          }
        }
      }
    },
    '/api/aep/segments': {
      get: {
        summary: 'List all segments',
        responses: {
          '200': {
            description: 'List of segments'
          }
        }
      },
      post: {
        summary: 'Create a new segment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'expression', 'schema'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  expression: {
                    type: 'object',
                    required: ['type', 'value'],
                    properties: {
                      type: { type: 'string' },
                      value: { type: 'object' }
                    }
                  },
                  schema: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                      name: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Segment created successfully'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};