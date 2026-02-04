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
  SchematicContext,
  SchematicsException,
  apply,
  applyTemplates,
  url,
  move,
  MergeStrategy,
  mergeWith,
  Tree,
} from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';

function addScriptsAndLintStaged(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adicionando scripts e lint-staged no package.json...');

    const packageJsonBuffer = tree.read('package.json');
    if (!packageJsonBuffer) {
      throw new SchematicsException('Arquivo package.json não encontrado');
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['lint'] = 'ng lint';
    packageJson.scripts['format'] = 'prettier --write "src/**/*.{ts,html,scss,css,json}"';
    if (!packageJson.scripts['prepare']) {
      packageJson.scripts['prepare'] = 'husky';
    }

    packageJson['lint-staged'] = {
      '*.{ts,html}': ['prettier --write', 'eslint --fix'],
      '*.{scss,css,json}': 'prettier --write',
    };

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    return tree;
  };
}

export default function (_options: OptionsDefaultModule): Rule {
  return () => {
    const templateSource = apply(url('./root-files'), [
      applyTemplates({}),
      move('/'),
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addScriptsAndLintStaged(),
    ]);
  };
}
