import { Rule } from '@angular-devkit/schematics';
import {
  buildComponent
} from '@angular/cdk/schematics';

import { Schema } from "@schematics/angular/component/schema";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function schematicsWebcomponent(options: Schema): Rule {
  debugger
  return buildComponent({...options});
}
