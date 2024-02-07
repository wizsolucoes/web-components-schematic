/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { OptionsDefaultModule } from '../types/options.types';



function addDependenciesDesignSystem(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const content = tree.read(packageJsonPath)?.toString('utf-8');

    if (!content) {
      throw new Error(`Arquivo ${packageJsonPath} não encontrado ou está vazio`);
    }

    const packageJson = JSON.parse(content);

    /// Verificando se já existe o pacote design system
    if (packageJson.dependencies['@wizco/fenixds-core']) {
      context.logger.info('A dependência @wizco/fenixds-core já existe no package.json');
    } else {
      context.logger.info('Adicionando a dependência design system CORE...');
      context.addTask(new NodePackageInstallTask({
        packageManager: 'npm',
        packageName: '@wizco/fenixds-core --legacy-peer-deps'
      }))
    };

    if (packageJson.dependencies['@wizco/fenixds-ngx']) {
      context.logger.info('A dependência @wizco/fenixds-ngx já existe no package.json');
    } else {
      context.logger.info('Adicionando a dependência design system NGX...');
      context.addTask(new NodePackageInstallTask({
        packageManager: 'npm',
        packageName: '@wizco/fenixds-ngx --legacy-peer-deps'
      }))
    };
    

    return tree;
  };
}

function addDependenciesAngularMaterial(options: OptionsDefaultModule): Rule {
  return (tree: Tree, context: SchematicContext) => {


    context.logger.info('Adicionando a dependência @angular/material...');
    externalSchematic('@angular/material', 'ng-add', {
      interactive: false
    });

    const localStyle =  options.folderModule === 'projects' ? `projects/${options.name}/src/app/app.component.scss` : `src/app/app.component.scss`;
    tree.overwrite(localStyle, `
@import '../style-material.scss';
    `);

    return tree;
  }
}


export default function (options: OptionsDefaultModule): Rule {

  return () => {
    return chain([
      addDependenciesDesignSystem(),
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
