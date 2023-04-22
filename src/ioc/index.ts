import { Container } from 'inversify';
import { Cache } from '../cache';
import { Importer } from '../importer';
import { Notifier } from '../notifier';
import { Scanner } from '../scanner';
import { ICache, IImporter, INotifier, IScanner } from '../interfaces';
import { TYPES } from './types';

const IOC = new Container();
IOC.bind<INotifier>(TYPES.notifier).to(Notifier).inSingletonScope();
IOC.bind<ICache>(TYPES.cache).to(Cache).inSingletonScope();
IOC.bind<IScanner>(TYPES.scanner).to(Scanner).inSingletonScope();
IOC.bind<IImporter>(TYPES.importer).to(Importer).inSingletonScope();

export { IOC };
