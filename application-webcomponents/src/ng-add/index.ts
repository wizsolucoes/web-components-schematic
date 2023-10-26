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
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';


function AddMFEComponents(options: ApplicationOptions): Rule {
  return (_: Tree, context: SchematicContext) => {
    const installTasMFEPackage = context.addTask(new NodePackageInstallTask({
      packageManager: 'npm',
      packageName: '@angular-architects/module-federation'
    }))
    const installTaskId = context.addTask(new RunSchematicTask("application", options), [installTasMFEPackage])
    const installMFE = context.addTask(new RunSchematicTask('application-mfe', options), [installTaskId]);
    const addPipeline = context.addTask(new RunSchematicTask('template-pipeline-ci', options), [installMFE]);
    context.addTask(new RunSchematicTask('application-mfe-final-change', options), [addPipeline]);
  }
}

export default function (options: ApplicationOptions): Rule {
  return () => {
    return chain([
      AddMFEComponents(options)
    ]);
  };
}
