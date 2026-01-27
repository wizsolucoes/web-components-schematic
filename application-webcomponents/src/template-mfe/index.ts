/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';



/**
 * 
 * @param options: OptionsDefaultModule
 * @returns Rule
 * @Description: Adicionando Angular material no projeto
 */
function addDependenciesAngularMaterial(options: OptionsDefaultModule): Rule {
  return (tree: Tree, context: SchematicContext) => {

    context.logger.info('Adicionando a dependência @angular/material...');
    externalSchematic('@angular/material', 'ng-add', {
      interactive: false
    });

    const localStyle =  options.folderModule === 'raiz' ? `src/app/app.component.scss` : `projects/${options.name}/src/app/app.component.scss`;
    tree.overwrite(localStyle, `
@import '../style-material.scss';
    `);

    return tree;
  }
}


export default function (options: OptionsDefaultModule): Rule {

  return () => {
    return chain([
      options.materialuser ? addDependenciesAngularMaterial(options) : () => {},
      externalSchematic('@angular-architects/module-federation', 'ng-add', {
        project: options.name,
        port: options.port
      }, {
        interactive: false
      })
    ]);
  };
}
