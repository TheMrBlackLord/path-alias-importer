import { injectable } from 'inversify';
import 'reflect-metadata';
import { window } from 'vscode';
import { INotifier } from './interfaces';

@injectable()
export class Notifier implements INotifier {
   errorNotify(message: string) {
      window.showErrorMessage(message);
   }
   warnNotify(message: string) {
      window.showWarningMessage(message);
   }
}
