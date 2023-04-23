export const oneAsteriskAtTheEnd = /[^*][*]$/gm;
export const hasFileExtensionAtTheEnd = /(?:\.ts|\.js)$/gi;
export const splitter = /\s*,\s*/gm;

/**
 * @example
 * export (class | interface | let | var | const | enum | type | function | function*) EntityName {}

   @summary
 * - group 'name' = EntityName
 */
export const exportEntityWithName =
   /export\s+(class|interface|let|var|const|enum|type|function)\s*\*?\s*(?<name>\w+)/gm;
/**
 * @example
 * export { EntityName1, EntityName2 }

   @summary
 * - group 'names' = 'EntityName1, EntityName2'
 */
export const exportByName = /export\s*\{\s*(?<names>\w+(?:\s*,\s*\w+)*),*\s*\}/gm;
/**
 * @example
 * export * from 'path/to/file';

   @summary
 * - group 'path' = 'path/to/file'
 */
export const exportAllFromPath = /export\s*\*\s*from\s*['"](?<path>[\w\/\\.-]*)['"]/gm;
/**
 * @example
 * export { EntityName, EntityName2 as EntityName3 } from 'path/to/file';

   @summary
 * - group 'names' = 'EntityName, EntityName2 as EntityName3 '
 * - group 'path' = 'path/to/file'
 */
export const exportNamesFromPath =
   /export\s*{\s*(?<names>[\w ,]+(?:\s*,\s*\w+)*)\s*}\s*from\s*['`"](?<path>[\w\/\\]*)['`"]/gm;
