import { mkdirSync, writeFile } from 'node:fs';
import { dirname } from 'node:path';

const DEFAULT_SCHEMA_FILE = './src/swagger/api-schema.json';

export const exportSchemaToFile = (
  schema: object,
  filePath: string = DEFAULT_SCHEMA_FILE,
) => {
  const content = JSON.stringify(schema, null, 2);

  mkdirSync(dirname(filePath), { recursive: true });

  writeFile(filePath, content, (err) => {
    if (err) console.error(err);
  });
};
