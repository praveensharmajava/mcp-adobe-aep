# MCP Adobe Experience Platform Server

This is a Node.js server that provides a comprehensive API interface for Adobe Experience Platform (AEP) integration. It supports various AEP functionalities including schemas, datasets, segments, profiles, and more.

## Features

- Schema Management
- Dataset Operations
- Segment Management
- Data Ingestion
- Profile Management
- Query Service
- Destinations Management
- Swagger Documentation
- Input Validation
- Error Handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Adobe Experience Platform account with API access
- Adobe Developer Console project with AEP integration

## Setup

1. Clone the repository:
```bash
git clone https://github.com/praveensharmajava/mcp-adobe-aep.git
cd mcp-adobe-aep
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Adobe credentials:
```env
PORT=3000
AEP_BASE_URL=https://platform.adobe.io
AEP_CLIENT_ID=your_client_id
AEP_CLIENT_SECRET=your_client_secret
AEP_ORG_ID=your_organization_id
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Schemas
- GET /api/aep/schemas - List all schemas
- POST /api/aep/schemas - Create a new schema

### Datasets
- GET /api/aep/datasets - List all datasets
- POST /api/aep/datasets - Create a new dataset

### Segments
- GET /api/aep/segments - List all segments
- POST /api/aep/segments - Create a new segment

### Data Ingestion
- POST /api/aep/ingest/:datasetId - Ingest data into a dataset

### Profiles
- GET /api/aep/profiles/:identityValue - Get unified profile

### Query Service
- POST /api/aep/query - Execute a query

### Destinations
- GET /api/aep/destinations - List all destinations
- POST /api/aep/destinations/:destinationId/activate/:segmentId - Activate a segment

## Error Handling

The server includes comprehensive error handling for:
- Adobe API errors
- Connection issues
- Validation errors
- Internal server errors

## Development

To contribute to the project:

1. Create a new branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## Testing

Run the test suite:
```bash
npm test
```

## License

ISC