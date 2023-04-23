import { inject, injectable } from 'inversify';
import path from 'path';
import 'reflect-metadata';
import { Uri, workspace } from 'vscode';
import { IAlias, ICache, INotifier, IResolvedAlias, IScanner } from './interfaces';
import { TYPES } from './ioc/types';
import { hasFileExtensionAtTheEnd, oneAsteriskAtTheEnd } from './regex/expressions';
import { checkExports } from './regex/functions';
import { Exports } from './types';

@injectable()
export class Scanner implements IScanner {
   constructor(
      @inject(TYPES.notifier) private readonly notifier: INotifier,
      @inject(TYPES.cache) private readonly cache: ICache
   ) {}

   private async findFiles(path: string): Promise<Uri[]> {
      const relativePath = workspace.asRelativePath(path);
      return await workspace.findFiles(relativePath, '**/node_modules/**');
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
   private async resolveExports(file: Uri): Promise<Exports> {
      const code = (await workspace.fs.readFile(file)).toString();
      const results = checkExports(code);
      const exports: Exports = [];
      for (const { names, path: exportPath } of results) {
         if (exportPath && names === '*') {
            let pathToFile = path.resolve(path.dirname(file.fsPath), exportPath);
            if (!pathToFile.match(hasFileExtensionAtTheEnd)) {
               pathToFile += '.{ts,js}';
            }
            const newFile = (await this.findFiles(pathToFile))[0];
            const newExports = await this.resolveExports(newFile);
            exports.push(...newExports);
         } else {
            exports.push(...names);
         }
      }
      return exports;
   }
   async getExports(aliases: IAlias[]): Promise<Exports> {
      const exports: Exports = [];
      const resolvedAliases = await this.resolveAliases(aliases);
      for (const { records } of resolvedAliases) {
         for (const alias in records) {
            for (const record of records[alias]) {
               const fileExports = await this.resolveExports(record);
               exports.push(...fileExports);
            }
         }
      }
      return exports;
   }
}
