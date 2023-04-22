export interface INotifier {
   errorNotify(message: string): void;
   warnNotify(message: string): void;
}
