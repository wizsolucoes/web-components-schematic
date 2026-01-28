/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';

export default function (options: OptionsDefaultModule): Rule {
  return () => {
    return chain([
      externalSchematic('@angular-architects/module-federation', 'ng-add', {
        project: options.name,
        port: options.port
      }, {
        interactive: false
      })
    ]);
  };
}
