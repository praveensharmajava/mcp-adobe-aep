export interface Schema {
  title: string;
  description?: string;
  type: string;
  properties: Record<string, any>;
}

export interface Dataset {
  name: string;
  description?: string;
  schemaRef: {
    id: string;
    contentType: string;
  };
}

export interface Segment {
  name: string;
  description?: string;
  expression: {
    type: string;
    value: Record<string, any>;
  };
  schema: {
    name: string;
  };
}

export interface Profile {
  identityMap: Record<string, any>;
  attributes: Record<string, any>;
  segments: string[];
}

export interface QueryResult {
  rows: any[];
  columns: string[];
  totalRows: number;
}

export interface Destination {
  id: string;
  name: string;
  type: string;
  status: string;
  connectionSpec: Record<string, any>;
}