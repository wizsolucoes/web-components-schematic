/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  chain, externalSchematic, Rule, SchematicContext, Tree
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';


function addDependenciesWebComponents(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const content = tree.read(packageJsonPath)?.toString('utf-8');

    if (!content) {
      throw new Error(`Arquivo ${packageJsonPath} não encontrado ou está vazio`);
    }

    const packageJson = JSON.parse(content);

    /// Verificando se já existe a dependência @angular/elements
    if (packageJson.dependencies['@angular/elements']) {
      context.logger.info('A dependência @angular/elements já existe no package.json');
    } else {
      context.logger.info('Adicionando a dependência web component...');
    };

    context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: '@angular/elements'
    }))

    return tree
  };
}

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
        packageName: '@wizco/fenixds-core'
      }))
    };

    if (packageJson.dependencies['@wizco/fenixds-ngx']) {
      context.logger.info('A dependência @wizco/fenixds-ngx já existe no package.json');
    } else {
      context.logger.info('Adicionando a dependência design system NGX...');
      context.addTask(new NodePackageInstallTask({
        packageManager: 'npm',
        packageName: '@wizco/fenixds-ngx'
      }))
    };
    

    return tree;
  };
}

function addDependenciesAngularMaterial(options: { name: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {

    context.addTask(new NodePackageInstallTask({
        packageManager: 'npm',
        packageName: '@angular/cdk @angular/material'
    }));
    context.logger.info('Adicionando a dependência Angular Material...');
    
    externalSchematic('@angular/material', 'ng-add', {
      interactive: false
    });

    tree.overwrite(`projects/${options.name}/src/app/app.component.scss`, `
@import '../style-material.scss';
    `);

    return tree;
  }
}


export default function (options: { port: string, name: string, materialuser: boolean, prefix: string }): Rule {

  return () => {
    return chain([
      addDependenciesWebComponents(),
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
