import { Uri } from 'vscode';
import { IResolvedAlias } from './resolvedAlias.interface';
import { Export } from '../types';

export interface ICache {
   length: number;
   resolved: IResolvedAlias[];
   exports: Export[];
   pushResolved(alias: string, base: string, file: Uri[]): void;
   pushExports(exports: Export[]): void;
   clear(): void;
}
