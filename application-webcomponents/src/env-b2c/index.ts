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
  Tree, 
} from '@angular-devkit/schematics';

function addPipelineDefault(): Rule {
  return (tree: Tree, context: SchematicContext) => {

    // eslint-disable-next-line no-debugger
    debugger
    context.logger.info('Adicionando o pipeline default...');
    const angularJson = tree.read(`angular.json`)!.toString('utf-8');

    if (!angularJson) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(angularJson.toString());
    const projects = packageJsonObject.projects;

    for (const project in projects) {
      if (
        projects[project].projectType === 'application' &&
        projects[project].architect &&
        projects[project].architect.build &&
        projects[project].architect.build.configurations &&
        projects[project].architect.build.configurations.sandbox
      ) {
        // script para criar o arquivo environment.b2c.ts
        const sandboxConfig = projects[project].architect.build.configurations.sandbox;
        const local = sandboxConfig['fileReplacements'][0]['with'];
        const localSandbox = tree.read(local)!.toString('utf-8');
        tree.create(local.replace('environment.sandbox.ts', 'environment.b2c.ts'), localSandbox);
        // script para adicionar no angular.json
        projects[project].architect.build.configurations['b2c'] = {
          ...sandboxConfig,
          fileReplacements: [
            {
              replace: sandboxConfig['fileReplacements'][0]['replace'],
              with: local.replace('environment.sandbox.ts', 'environment.b2c.ts' ),
            },
          ],
        };
      }
    }

    const newAngular = {
      ...packageJsonObject,
      projects: projects,
    };

    tree.overwrite(`angular.json`, JSON.stringify(newAngular, null, 2));
    return tree
  };
}

export default function (): Rule {
  return () => {
    return chain([
      addPipelineDefault()
    ]);
  };
}
