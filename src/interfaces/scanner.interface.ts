import { Exports } from '../types';
import { IAlias } from './alias.interface';

export interface IScanner {
   findAliases(rootPath: string): Promise<IAlias[]>;
   getExports(aliases: IAlias[]): Promise<Exports>;
}
