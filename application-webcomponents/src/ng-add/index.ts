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
import { packagesVersions, packagesVersionsMaterial } from './versionsPackages';



/**
 * 
 * @param options: OptionsDefaultModule
 * @returns Rule
 * @Description: Adiciona os pacotes necessários para o projeto
 */
function InstallPackagesRequire(options: OptionsDefaultModule): Rule {
  return (_: Tree, context: SchematicContext) => {
    const versionAngular = options.versionAngular || '17'
    let packagesRequire = packagesVersions[versionAngular];
    let packageMaterial = packagesVersionsMaterial[versionAngular]
  
    if(options.materialuser) {
      packagesRequire.push(...packageMaterial)
    };

    let packagesInstall =  packagesRequire.join(' ');

    context.logger.info('Adicionando pacotes necessários'); 
    const installTasMFEPackage = context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: packagesInstall + ' --legacy-peer-deps'
    }))
    const installTaskId = context.addTask(new RunSchematicTask("application", options), [installTasMFEPackage]);
    const installMFE = context.addTask(new RunSchematicTask('application-mfe', options), [installTaskId]);
    const addPipeline = context.addTask(new RunSchematicTask('template-pipeline-ci', options), [installMFE]);
    const addEslintPrettier = context.addTask(new RunSchematicTask('template-add-eslint-prettier', options), [addPipeline]);
    context.addTask(new RunSchematicTask('application-mfe-final-change', options), [addEslintPrettier]);
  }
}

export default function (options: OptionsDefaultModule): Rule {
  return () => {
    return chain([
      InstallPackagesRequire(options)
    ]);
  };
}
