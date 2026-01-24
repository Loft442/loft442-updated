import { type SchemaTypeDefinition } from "sanity";

import availability from "./availability";

export const schemaTypes: SchemaTypeDefinition[] = [availability];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
