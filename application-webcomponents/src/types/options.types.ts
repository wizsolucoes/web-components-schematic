import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

export interface OptionsDefaultModule extends ApplicationOptions {
  port: number;
  produtoDigital: string
}