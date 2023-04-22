import { Export } from '../types';
import * as regex from './expressions';

export function checkExports(code: string) {
   const checks = [
      checkExportEntityWithName(code),
      checkExportByName(code),
      checkExportAllFromPath(code),
      checkExportNamesFromPath(code)
   ];

   return checks.reduce<Export[]>((prev, curr) => {
      if (Array.isArray(curr)) {
         prev.push(...curr);
      }
      return prev;
   }, []);
}

function checkExportEntityWithName(code: string) {
   const matches = code.matchAll(regex.exportEntityWithName);
   const result: Export[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push(match.groups.name);
      }
   }
   return result.length ? result : false;
}

function checkExportByName(code: string) {
   const matches = code.matchAll(regex.exportByName);
   const result: Export[] = [];
   for (const match of matches) {
      if (match.groups) {
         result.push(...match.groups.names.trim().split(regex.splitter));
      }
   }
   return result.length ? result : false;
}

function checkExportAllFromPath(code: string) {
   const matches = code.matchAll(regex.exportAllFromPath);
   const result: Export[] = [];
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

function checkExportNamesFromPath(code: string) {
   const matches = code.matchAll(regex.exportNamesFromPath);
   const result: Export[] = [];
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
