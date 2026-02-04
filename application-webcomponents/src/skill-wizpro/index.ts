/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Rule,
  apply,
  mergeWith,
  move,
  url,
  MergeStrategy,
} from '@angular-devkit/schematics';

export default function (): Rule {
  const templateSource = apply(url('./root-files'), [
    move('/'),
  ]);
  return mergeWith(templateSource, MergeStrategy.Overwrite);
}
