import { Uri } from 'vscode';
import { IResolvedAlias } from './resolvedAlias.interface';
import { Exports } from '../types';

export interface ICache {
   length: number;
   resolved: IResolvedAlias[];
   exports: Exports;
   pushResolved(alias: string, base: string, file: Uri[]): void;
   pushExports(exports: Exports): void;
   clear(): void;
}
