/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { join, normalize } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain, MergeStrategy, mergeWith,
  move, Rule, strings, Tree, url
} from '@angular-devkit/schematics';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';



export default function (options: ApplicationOptions): Rule {
  return async (host: Tree) => {

    const workspace = await getWorkspace(host);
    const newProjectRoot = (workspace.extensions.newProjectRoot as string | undefined) || '';
    const isRootApp = options.projectRoot !== undefined;

    // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
    let folderName = options.name.startsWith('@') ? options.name.slice(1) : options.name;
    if (/[A-Z]/.test(folderName)) {
      folderName = strings.dasherize(folderName);
    }

    const appDir = isRootApp
      ? normalize(options.projectRoot || '')
      : join(normalize(newProjectRoot), folderName);
    const sourceDir = `${appDir}`;

    return chain([
      mergeWith(
        apply(url('./files-webpack'), [
          applyTemplates({
            ...options,
          }),
          move(sourceDir),
        ]),
        MergeStrategy.Overwrite,
      )
    ]);
  };
}
