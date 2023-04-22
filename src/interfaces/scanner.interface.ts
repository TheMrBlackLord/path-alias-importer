import { IAlias } from './alias.interface';

export interface IScanner {
   findAliases(rootPath: string): Promise<IAlias[]>;
   parseAliases(aliases: IAlias[]): void;
}
