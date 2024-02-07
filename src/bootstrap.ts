import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
declare const require: any;

const ngVersion = require('../package.json').dependencies[
  '@angular/core'
]; // better just take the major version

function getMajor(version: string) {
  return version.split('.')[0].replace(/[^0-9]/g, '');
}

const plattform = (window as any).plattform || {};

let platform: any;
Object.keys(plattform).forEach((key) => {
  if (getMajor(ngVersion) === getMajor(key)) {
    platform = plattform[key];
  }
});

if (!platform) {
  platform = platformBrowser();
  (window as any).plattform[ngVersion] = platform;
}

platform.bootstrapModule(AppModule, { ngZone: (window as any).ngZone }).catch((err: any) => console.error(err));
