import { ParsingResult } from '../types';
import * as regex from './expressions';

export function checkExports(code: string) {
   const checks = [
      checkExportEntityWithName(code),
      checkExportByName(code),
      checkExportAllFromPath(code),
      checkExportNamesFromPath(code)
   ];

   return checks.reduce<ParsingResult[]>((prev, curr) => {
      if (Array.isArray(curr)) {
         prev.push(...curr);
      }
      return prev;
   }, []);
}

function checkExportEntityWithName(code: string) {
   const matches = code.matchAll(regex.exportEntityWithName);
   const result: ParsingResult[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push({
            names: [match.groups.name]
         });
      }
   }
   return result.length ? result : false;
}

function checkExportByName(code: string) {
   const matches = code.matchAll(regex.exportByName);
   const result: ParsingResult[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push({
            names: match.groups.names.trim().split(regex.splitter)
         });
      }
   }
   return result.length ? result : false;
}

function checkExportAllFromPath(code: string) {
   const matches = code.matchAll(regex.exportAllFromPath);
   const result: ParsingResult[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push({
            names: '*',
            path: match.groups.path
         });
      }
   }
   return result.length ? result : false;
}

// TODO: handle export { Asd as DSFSDF } from ''
// replace('Asd as', '');
function checkExportNamesFromPath(code: string) {
   const matches = code.matchAll(regex.exportNamesFromPath);
   const result: ParsingResult[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push({
            names: match.groups.names.trim().split(regex.splitter),
            path: match.groups.path
         });
      }
   }
   return result.length ? result : false;
}
