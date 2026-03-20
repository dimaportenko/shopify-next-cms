import type { ShopifyClient } from "./shopify-client.js";

export interface Migration {
  id: string;
  description: string;
  up: (client: ShopifyClient) => Promise<void>;
  down?: (client: ShopifyClient) => Promise<void>;
}

export interface MetaobjectField {
  key: string;
  value?: string | null;
}

export interface MetaobjectNode {
  id: string;
  handle: string;
  fields: MetaobjectField[];
}

export interface MetaobjectFieldDefinition {
  key: string;
  name: string;
  type: string;
}

export interface MetaobjectDefinition {
  id: string;
  type: string;
  name: string;
  fieldDefinitions: MetaobjectFieldDefinition[];
}
