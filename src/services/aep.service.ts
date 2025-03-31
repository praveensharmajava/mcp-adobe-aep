import axios from 'axios';
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
    // Set default values
    const defaultBaseUrl = 'https://platform.adobe.io';

    // Load and validate environment variables
    this.baseUrl = process.env.AEP_BASE_URL || defaultBaseUrl;
    this.clientId = process.env.AEP_CLIENT_ID || '';
    this.clientSecret = process.env.AEP_CLIENT_SECRET || '';
    this.orgId = process.env.AEP_ORG_ID || '';
    this.accessToken = null;

    // Log configuration (safely)
    console.log('AEP Service Configuration:', {
      baseUrl: this.baseUrl,
      clientId: this.clientId ? '***' + this.clientId.slice(-4) : 'missing',
      clientSecret: this.clientSecret ? '***' + this.clientSecret.slice(-4) : 'missing',
      orgId: this.orgId ? '***' + this.orgId.slice(-4) : 'missing'
    });

    // Validate required credentials
    if (!this.clientId || !this.clientSecret || !this.orgId) {
      throw new Error('Missing required Adobe credentials. Please check your environment variables: AEP_CLIENT_ID, AEP_CLIENT_SECRET, and AEP_ORG_ID');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      console.log('Attempting to get access token with:', {
        clientId: this.clientId ? '***' + this.clientId.slice(-4) : 'missing',
        clientSecret: this.clientSecret ? '***' + this.clientSecret.slice(-4) : 'missing',
        orgId: this.orgId ? '***' + this.orgId.slice(-4) : 'missing'
      });

      // Create form data
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      formData.append('scope', 'openid,AdobeID,read_organizations,additional_info.projectedProductContext,session');

      const response = await axios.post<{ access_token: string }>(
        'https://ims-na1.adobelogin.com/ims/token/v2',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Failed to obtain access token: ${error.message}`);
    }
  }

  private async getHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': this.clientId,
      'x-gw-ims-org-id': this.orgId,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.adobe.xed-id+json'
    };
  }

  // Schemas API
  async listSchemas(): Promise<Schema[]> {
    const url = `${this.baseUrl}/data/foundation/schemaregistry/tenant/schemas?orderby=title`;
    
    console.log('Making API call to:', url);
    const headers = await this.getHeaders();
    console.log('Request headers:', {
      ...headers,
      'Authorization': headers.Authorization ? '***' + headers.Authorization.slice(-10) : 'missing'
    });
    
    try {
      const response = await axios.get<{ results: Schema[] }>(
        url,
        { headers }
      );
      console.log('Schema API Response:', response.data);
      return response.data.results || [];
    } catch (error: any) {
      console.error('Schema API Error:', {
        url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  }

  async createSchema(schema: Schema): Promise<Schema> {
    const url = `${this.baseUrl}/data/foundation/schemaregistry/schemas`;
    console.log('Making API call to:', url);
    const headers = await this.getHeaders();
    const response = await axios.post<Schema>(
      url,
      schema,
      { headers }
    );
    return response.data;
  }

  // Datasets API
  async listDatasets(params: { limit?: number; offset?: number } = {}): Promise<Dataset[]> {
    const url = `${this.baseUrl}/data/foundation/catalog/datasets`;
    console.log('Making API call to:', url);
    const headers = await this.getHeaders();
    const response = await axios.get<{ datasets: Dataset[] }>(
      url,
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