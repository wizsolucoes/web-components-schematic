/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  chain, Rule, SchematicContext, Tree
} from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { exec } from 'child_process';


async function addDependenciesWebComponents(
  options: any
): Promise<Rule> {
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
      exec('npm install @angular/elements', (err) => {
        context.logger.error(`Erro ao instalar dependências: @angular/elements - ${err}`);
      })
    };

    /// Verificando se já existe a dependência @angular-architects/module-federation

    exec(`ng add @angular-architects/module-federation --project ${options.name} --port ${options.port} --skip-confirmation`, (error) => {
      if (error) {
        context.logger.error(`Erro ao instalar dependências: @angular-architects/module-federation - ${error}`);
        return;
      }
      context.addTask(new RunSchematicTask("application-mfe-final-change", options))
    });

    return tree
  };
}


export default function (options: ApplicationOptions): Rule {
  return async () => {
    return chain([
      await addDependenciesWebComponents(options)
    ]);
  };
}
