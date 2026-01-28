/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * 
 * @returns Rule
 * @Description: Remove arquivos desnecessários do template inicial do Angular
 */
export default function (): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const filesToRemove = [
      'src/app/app.config.ts',
      'src/app/app.routes.ts',
      'src/app/app.html',
      'src/app/app.scss',
      'src/app/app.spec.ts',
      'src/app/app.ts'
    ];

    context.logger.info('Removendo arquivos desnecessários do template inicial...');

    filesToRemove.forEach(filePath => {
      if (tree.exists(filePath)) {
        tree.delete(filePath);
        context.logger.info(`  Removido: ${filePath}`);
      }
    });

    return tree;
  };
}
