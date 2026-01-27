import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

export interface OptionsDefaultModule extends ApplicationOptions {
  folderModule: 'raiz';
  materialuser: boolean;
  port: number;
  produtoDigital: string
}