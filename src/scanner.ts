import { inject, injectable } from 'inversify';
import path from 'path';
import 'reflect-metadata';
import { Uri, workspace } from 'vscode';
import { oneAsteriskAtTheEnd } from './regex/expressions';
import { IAlias, ICache, INotifier, IResolvedAlias, IScanner } from './interfaces';
import { TYPES } from './ioc/types';
import { checkExports } from './regex/functions';

@injectable()
export class Scanner implements IScanner {
   constructor(
      @inject(TYPES.notifier) private readonly notifier: INotifier,
      @inject(TYPES.cache) private readonly cache: ICache
   ) {}

   private async findFiles(path: string): Promise<Uri[]> {
      return await workspace.findFiles(path, '**/node_modules/**');
   }
   async findAliases(): Promise<IAlias[]> {
      const configs = await this.findFiles('**/{ts,js}config.*.json');
      const aliases: IAlias[] = [];
      for (const config of configs) {
         try {
            const file = await workspace.fs.readFile(config);
            const cfg = JSON.parse(file.toString());
            if (cfg?.compilerOptions?.paths && cfg?.compilerOptions?.baseUrl) {
               const {
                  compilerOptions: { baseUrl, paths }
               } = cfg;
               aliases.push({
                  path: workspace.asRelativePath(config),
                  baseUrl,
                  paths
               });
            }
         } catch (e) {
            this.notifier.warnNotify(`Error during reading ${config.fsPath}`);
         }
      }
      return aliases;
   }
   private async resolveAliases(aliases: IAlias[]): Promise<IResolvedAlias[]> {
      for (const alias of aliases) {
         for (const pathsAlias in alias.paths) {
            let filePath: string = path.join(
               path.dirname(alias.path),
               alias.baseUrl,
               alias.paths[pathsAlias][0]
            );
            if (filePath.match(oneAsteriskAtTheEnd)) {
               filePath += '*\\*.{ts,js}';
            }
            const base = workspace.asRelativePath(alias.path);
            const files = await this.findFiles(filePath);
            this.cache.pushResolved(pathsAlias, base, files);
         }
      }
      return this.cache.resolved;
   }
   async parseAliases(aliases: IAlias[]) {
      const resolvedAliases = await this.resolveAliases(aliases);
      for (const { records } of resolvedAliases) {
         for (const alias in records) {
            for (const record of records[alias]) {
               const code = (await workspace.fs.readFile(record)).toString();
               this.cache.pushExports(checkExports(code));
            }
         }
      }
   }
}
