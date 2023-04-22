import * as vscode from 'vscode';
import { IOC } from './ioc';
import { ICache, IImporter } from './interfaces';
import { TYPES } from './ioc/types';

export function activate(context: vscode.ExtensionContext) {
   IOC.bind<vscode.ExtensionContext>(TYPES.context).toConstantValue(context);
   const importer = IOC.get<IImporter>(TYPES.importer);
   importer.subscribe();
}

export function deactivate() {
   const cache = IOC.get<ICache>(TYPES.cache);
   cache.clear();
}
