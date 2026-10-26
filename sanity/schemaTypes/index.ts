import { type SchemaTypeDefinition } from "sanity";

import availability from "./availability";
import galleryItem from "./galleryItem";

export const schemaTypes: SchemaTypeDefinition[] = [availability, galleryItem];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
