import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
   ExtensionContext,
   StatusBarAlignment,
   commands,
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

      this.context.subscriptions.push(scanAliasesCommand);
   }
   public async setup() {
      const root = workspace.workspaceFolders?.[0];
      if (!root) {
         this.notifier.errorNotify(MESSAGES.UNDEFINED_ROOT);
         return false;
      }
      await this.getAliases(root.uri.fsPath);
      this.statusBar.text = `Aliases: ${this.cache.length}`;
      return true;
   }
   private async getAliases(rootPath: string) {
      const aliases = await this.scanner.findAliases(rootPath);
      await this.scanner.parseAliases(aliases);
      // console.log(this.cache.aliases);
   }
}
