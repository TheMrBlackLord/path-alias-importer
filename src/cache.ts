import { injectable } from 'inversify';
import 'reflect-metadata';
import { ICache, IResolvedAlias } from './interfaces';
import { Uri } from 'vscode';
import { Exports } from './types';

@injectable()
export class Cache implements ICache {
   private _resolved: IResolvedAlias[] = [];
   private _length = 0;
   private _exports: Exports = [];

   get length(): number {
      return this._length;
   }
   get resolved(): IResolvedAlias[] {
      return this._resolved;
   }
   get exports(): Exports {
      return this._exports;
   }
   pushExports(exports: Exports) {
      this._exports.push(...exports);
   }
   pushResolved(alias: string, base: string, files: Uri[]) {
      const resolved = this._resolved.find(file => file.base === base);
      if (resolved) {
         if (Object.prototype.hasOwnProperty.call(resolved.records, alias)) {
            resolved.records[alias].push(...files);
         } else {
            resolved.records[alias] = files;
         }
      } else {
         this._resolved.push({
            base,
            records: { [alias]: files }
         });
         this._length++;
      }
   }

   clear() {
      this._length = 0;
      this._resolved = [];
      this._exports = [];
   }
}
