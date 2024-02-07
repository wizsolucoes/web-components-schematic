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

function InstallPackagesRequire(options: OptionsDefaultModule): Rule {
  return (_: Tree, context: SchematicContext) => {
    const versionAngular = options.versionAngular || '17'
    const packagesRequire = [
      '@angular-architects/module-federation',
      '@angular/elements',
      '@angular-eslint/schematics'
    ]
    
    const packageMaterial = [
      '@angular/cdk',
      '@angular/material'
    ]

    if(options.materialuser) {
      packagesRequire.push(...packageMaterial)
    };

    let packagesInstall =  packagesRequire.map((pkg) => {
      return pkg + '@' + versionAngular + '.x'
    }).join(' ');


    context.logger.info('Adicionando pacotes necessários'); 
    const installTasMFEPackage = context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: packagesInstall + ' --legacy-peer-deps'
    }))
    const installTaskId = context.addTask(new RunSchematicTask("application", options), [installTasMFEPackage]);
    const installMFE = context.addTask(new RunSchematicTask('application-mfe', options), [installTaskId]);
    const addPipeline = context.addTask(new RunSchematicTask('template-pipeline-ci', options), [installMFE]);
    console.log('options', addPipeline)
    // context.addTask(new RunSchematicTask('application-mfe-final-change', options), [addPipeline]);
    // const AddLint = context.addTask(new RunSchematicTask('@angular-eslint/schematics', 'ng-add', options), [installTaskId]);
  }
}

export default function (options: OptionsDefaultModule): Rule {
  return () => {
    return chain([
      InstallPackagesRequire(options)
    ]);
  };
}
