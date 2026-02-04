/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { normalize } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain, MergeStrategy, mergeWith,
  move, Rule, strings, url
} from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';



export default function (options: OptionsDefaultModule): Rule {
  return async () => {
    // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
    let folderName = options.name.startsWith('@') ? options.name.slice(1) : options.name;
    if (/[A-Z]/.test(folderName)) {
      folderName = strings.dasherize(folderName);
    }


    const appDir = `/`;
    const pathExposes = `./src`;
    const sourceDir = normalize(`${appDir}`);
    

    return chain([
      mergeWith(
        apply(url('./files-webpack'), [
          applyTemplates({
            ...options,
            pathPackage: './tsconfig.json',
            pathExposes: normalize(pathExposes),
          }),
          move(sourceDir),
        ]),
        MergeStrategy.Overwrite,
      ),
    ]);
  };
}
