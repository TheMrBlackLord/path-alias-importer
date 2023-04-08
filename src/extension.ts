import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
   const disposable = vscode.commands.registerCommand(
      'path-alias-importer.helloWorld',
      () => {
         vscode.window.showInformationMessage('Hello World from Path Alias Importer!');
      }
   );

   context.subscriptions.push(disposable);
}

export function deactivate() {}
