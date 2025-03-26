import axios, { AxiosResponse } from 'axios';
import { createHmac } from 'crypto';
import {
  Schema,
  Dataset,
  Segment,
  Profile,
  QueryResult,
  Destination
} from '../types/aep.types';

export class AEPService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private orgId: string;
  private accessToken: string | null;

  constructor() {
    this.baseUrl = process.env.AEP_BASE_URL || 'https://platform.adobe.io';
    this.clientId = process.env.AEP_CLIENT_ID || '';
    this.clientSecret = process.env.AEP_CLIENT_SECRET || '';
    this.orgId = process.env.AEP_ORG_ID || '';
    this.accessToken = null;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      const response = await axios.post<{ access_token: string }>('https://ims-na1.adobelogin.com/ims/token/v1', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: 'AdobeID,openid,read_organizations'
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      throw new Error('Failed to obtain access token');
    }
  }

  private async getHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': this.clientId,
      'x-gw-ims-org-id': this.orgId,
      'Content-Type': 'application/json'
    };
  }

  // Schemas API
  async listSchemas(params: { limit?: number; offset?: number } = {}): Promise<Schema[]> {
    const headers = await this.getHeaders();
    const response = await axios.get<{ schemas: Schema[] }>(
      `${this.baseUrl}/data/foundation/schemaregistry/schemas`,
      { headers, params }
    );
    return response.data.schemas;
  }

  async createSchema(schema: Schema): Promise<Schema> {
    const headers = await this.getHeaders();
    const response = await axios.post<Schema>(
      `${this.baseUrl}/data/foundation/schemaregistry/schemas`,
      schema,
      { headers }
    );
    return response.data;
  }

  // Datasets API
  async listDatasets(params: { limit?: number; offset?: number } = {}): Promise<Dataset[]> {
    const headers = await this.getHeaders();
    const response = await axios.get<{ datasets: Dataset[] }>(
      `${this.baseUrl}/data/foundation/catalog/datasets`,
      { headers, params }
    );
    return response.data.datasets;
  }

  async createDataset(dataset: Dataset): Promise<Dataset> {
    const headers = await this.getHeaders();
    const response = await axios.post<Dataset>(
      `${this.baseUrl}/data/foundation/catalog/datasets`,
      dataset,
      { headers }
    );
    return response.data;
  }

  // Segments API
  async listSegments(params: { limit?: number; offset?: number } = {}): Promise<Segment[]> {
    const headers = await this.getHeaders();
    const response = await axios.get<{ segments: Segment[] }>(
      `${this.baseUrl}/data/core/ups/segments`,
      { headers, params }
    );
    return response.data.segments;
  }

  async createSegment(segment: Segment): Promise<Segment> {
    const headers = await this.getHeaders();
    const response = await axios.post<Segment>(
      `${this.baseUrl}/data/core/ups/segments`,
      segment,
      { headers }
    );
    return response.data;
  }

  // Data Ingestion API
  async ingestData(datasetId: string, data: any): Promise<{ id: string; status: string }> {
    const headers = await this.getHeaders();
    const response = await axios.post<{ id: string; status: string }>(
      `${this.baseUrl}/data/foundation/import/batches/${datasetId}/datasets`,
      data,
      { headers }
    );
    return response.data;
  }

  // Profile API
  async getUnifiedProfile(identityValue: string, identityNamespace: string): Promise<Profile> {
    const headers = await this.getHeaders();
    const response = await axios.get<Profile>(
      `${this.baseUrl}/data/core/ups/access/entities`,
      {
        headers,
        params: {
          schema: 'https://ns.adobe.com/xdm/context/profile',
          entityId: identityValue,
          entityIdNS: identityNamespace
        }
      }
    );
    return response.data;
  }

  // Query Service API
  async executeQuery(query: string): Promise<QueryResult> {
    const headers = await this.getHeaders();
    const response = await axios.post<QueryResult>(
      `${this.baseUrl}/data/foundation/query/queries`,
      { query },
      { headers }
    );
    return response.data;
  }

  // Destinations API
  async listDestinations(): Promise<Destination[]> {
    const headers = await this.getHeaders();
    const response = await axios.get<{ destinations: Destination[] }>(
      `${this.baseUrl}/data/core/activation/destinations`,
      { headers }
    );
    return response.data.destinations;
  }

  async activateSegment(destinationId: string, segmentId: string): Promise<{ status: string }> {
    const headers = await this.getHeaders();
    const response = await axios.post<{ status: string }>(
      `${this.baseUrl}/data/core/activation/destinations/${destinationId}/activate`,
      {
        segmentIds: [segmentId]
      },
      { headers }
    );
    return response.data;
  }
}