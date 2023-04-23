import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
   CompletionItemProvider,
   ExtensionContext,
   StatusBarAlignment,
   commands,
   languages,
   window,
   workspace
} from 'vscode';
import { ICache, IImporter, INotifier, IScanner } from './interfaces';
import { MESSAGES } from './messages';
import { TYPES } from './ioc/types';

@injectable()
export class Importer implements IImporter {
   private readonly statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
   constructor(
      @inject(TYPES.context) private readonly context: ExtensionContext,
      @inject(TYPES.scanner) private readonly scanner: IScanner,
      @inject(TYPES.completion)
      private readonly completionProvider: CompletionItemProvider,
      @inject(TYPES.cache) private readonly cache: ICache,
      @inject(TYPES.notifier) private readonly notifier: INotifier
   ) {
      this.statusBar.show();
      this.statusBar.text = 'Aliases: 0';
   }
   public subscribe() {
      const scanAliasesCommand = commands.registerCommand(
         'path-alias-importer.scan-aliases',
         () => {
            this.setup();
         }
      );
      const completion = languages.registerCompletionItemProvider(
         ['typescript', 'javascript'],
         this.completionProvider
      );
      this.context.subscriptions.push(scanAliasesCommand, completion);
   }
   public async setup() {
      const root = workspace.workspaceFolders?.[0];
      if (!root) {
         this.notifier.errorNotify(MESSAGES.UNDEFINED_ROOT);
         return false;
      }
      await this.getAllExports(root.uri.fsPath);
      this.statusBar.text = `Aliases: ${this.cache.length}`;
      return true;
   }
   private async getAllExports(rootPath: string) {
      const aliases = await this.scanner.findAliases(rootPath);
      const exports = await this.scanner.getExports(aliases);
      console.log(exports);
   }
}
