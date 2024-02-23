/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  chain, 
  Rule,
  externalSchematic,
  apply,
  url,
  move,
  MergeStrategy,
  mergeWith,
} from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';


export default function (options: OptionsDefaultModule): Rule {  

  return () => {
     const templateSource = apply(url('./root-files'), [
      move('/')
    ]);
    return chain([
      // Add external schematic eslint and prettier
      mergeWith(templateSource, MergeStrategy.Overwrite),
      externalSchematic('@angular-eslint/schematics', 'ng-add', {
        project: options.name
      }, {
        interactive: false
      })
    ]);
  };
}
