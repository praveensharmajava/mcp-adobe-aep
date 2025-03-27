import { Router } from 'express';
import { AEPService } from '../services/aep.service';
import { validateSchema } from '../middleware/validation.middleware';
import { schemaValidation, datasetValidation, segmentValidation } from '../validations/aep.validation';

const router = Router();
const aepService = new AEPService();

// Schema endpoints
router.get('/schemas', async (req, res, next) => {
  try {
    const schemas = await aepService.listSchemas();
    res.json({
      status: 'success',
      data: schemas
    });
  } catch (error) {
    next(error);
  }
});

router.post('/schemas', validateSchema(schemaValidation), async (req, res, next) => {
  try {
    const schema = await aepService.createSchema(req.body);
    res.status(201).json(schema);
  } catch (error) {
    next(error);
  }
});

// Dataset endpoints
router.get('/datasets', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const datasets = await aepService.listDatasets({ 
      limit: Number(limit), 
      offset: Number(offset) 
    });
    res.json(datasets);
  } catch (error) {
    next(error);
  }
});

router.post('/datasets', validateSchema(datasetValidation), async (req, res, next) => {
  try {
    const dataset = await aepService.createDataset(req.body);
    res.status(201).json(dataset);
  } catch (error) {
    next(error);
  }
});

// Segment endpoints
router.get('/segments', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const segments = await aepService.listSegments({ 
      limit: Number(limit), 
      offset: Number(offset) 
    });
    res.json(segments);
  } catch (error) {
    next(error);
  }
});

router.post('/segments', validateSchema(segmentValidation), async (req, res, next) => {
  try {
    const segment = await aepService.createSegment(req.body);
    res.status(201).json(segment);
  } catch (error) {
    next(error);
  }
});

// Data Ingestion endpoint
router.post('/ingest/:datasetId', async (req, res, next) => {
  try {
    const { datasetId } = req.params;
    const result = await aepService.ingestData(datasetId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Profile endpoint
router.get('/profiles/:identityValue', async (req, res, next) => {
  try {
    const { identityValue } = req.params;
    const { namespace } = req.query;
    const profile = await aepService.getUnifiedProfile(
      identityValue,
      namespace as string
    );
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Query Service endpoint
router.post('/query', async (req, res, next) => {
  try {
    const { query } = req.body;
    const result = await aepService.executeQuery(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Destinations endpoints
router.get('/destinations', async (req, res, next) => {
  try {
    const destinations = await aepService.listDestinations();
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

router.post('/destinations/:destinationId/activate/:segmentId', async (req, res, next) => {
  try {
    const { destinationId, segmentId } = req.params;
    const result = await aepService.activateSegment(destinationId, segmentId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const aepRoutes = router;