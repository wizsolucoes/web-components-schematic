import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

export interface OptionsDefaultModule extends ApplicationOptions {
  versionAngular: '16' | '17';
  folderModule: 'projects' | 'raiz';
  materialuser: boolean;
  port: number;
}