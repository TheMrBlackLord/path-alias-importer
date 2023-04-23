/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
   CancellationToken,
   CompletionContext,
   CompletionItem,
   CompletionItemKind,
   CompletionItemProvider,
   CompletionList,
   CompletionTriggerKind,
   Position,
   ProviderResult,
   TextDocument
} from 'vscode';
import { TYPES } from './ioc/types';
import { ICache } from './interfaces';

@injectable()
export class CompletionProvider implements CompletionItemProvider {
   constructor(@inject(TYPES.cache) private readonly cache: ICache) {}
   provideCompletionItems(
      _document: TextDocument,
      _position: Position,
      _token: CancellationToken,
      _context: CompletionContext
   ): ProviderResult<CompletionItem[]> {
      return this.cache.exports.map(exportItem => {
         if (Array.isArray(exportItem)) {
            return this.buildCompletionItem(exportItem[0]);
         }
         return this.buildCompletionItem('');
      });
   }
   private buildCompletionItem(label: string): CompletionItem {
      return {
         label,
         kind: CompletionItemKind.Reference,
         detail: 'details test items sdfsdf'
      };
   }
}
