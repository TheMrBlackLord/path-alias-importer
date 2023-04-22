import { Uri } from 'vscode';

export interface IResolvedAlias {
   base: string;
   records: {
      [alias: string]: Uri[];
   };
}
