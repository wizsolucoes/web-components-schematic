/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { OptionsDefaultModule } from '../types/options.types'
import { packagesVersions, packagesVersionsDev } from './versionsPackages';



/**
 * 
 * @param options: OptionsDefaultModule
 * @returns Rule
 * @Description: Adiciona os pacotes necessários para o projeto
 */
function InstallPackagesRequire(options: OptionsDefaultModule): Rule {
  return (_: Tree, context: SchematicContext) => {
    const versionAngular = 20;
    const packagesRequire = [...packagesVersions[versionAngular]];
    const packagesDev = [...packagesVersionsDev[versionAngular]];


    const packagesInstall = packagesRequire.join(' ');
    const packagesDevInstall = packagesDev.join(' ');

    context.logger.info('Adicionando pacotes necessários'); 
    context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: packagesInstall + ' --legacy-peer-deps'
    }))
    
    context.logger.info('Adicionando pacotes de desenvolvimento'); 
    const installDevTaskId = context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: packagesDevInstall + ' --save-dev --legacy-peer-deps'
    }))
    
    context.logger.info('Adicionando template webcomponents'); 
    const { folderModule, materialuser, ...templateOptions } = options as any;
    context.addTask(new RunSchematicTask("template-webcomponents", templateOptions), [installDevTaskId]);
    // const installMFE = context.addTask(new RunSchematicTask('application-mfe', options), [installTaskId]);
    // const addPipeline = context.addTask(new RunSchematicTask('template-pipeline-ci', options), [installMFE]);
    // const addEslintPrettier = context.addTask(new RunSchematicTask('template-add-eslint-prettier', options), [addPipeline]);
    // context.addTask(new RunSchematicTask('application-mfe-final-change', options), [addEslintPrettier]);
  }
}

export default function (options: OptionsDefaultModule): Rule {
  return () => {
    return chain([
      InstallPackagesRequire(options)
    ]);
  };
}
