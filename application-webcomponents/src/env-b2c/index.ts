/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule, 
  SchematicContext, 
  SchematicsException, 
  Tree,
  url, 
} from '@angular-devkit/schematics';
import { OptionsDefaultModule } from '../types/options.types';

function addStepb2c(options: OptionsDefaultModule): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adicionando angular.json');
    const angularJson = tree.read(`angular.json`)!.toString('utf-8');

    if (!angularJson) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(angularJson.toString());
    const projects = packageJsonObject.projects;
    const projectsKeys = [];

    for (const project in projects) {
      if (
        projects[project].projectType === 'application' &&
        projects[project].architect &&
        projects[project].architect.build &&
        projects[project].architect.build.configurations &&
        projects[project].architect.build.configurations.sandbox &&
        projects[project].architect.build.configurations.sandbox['fileReplacements']
      ) {
        // script para criar o arquivo environment.b2c.ts
        const sandboxConfig = projects[project].architect.build.configurations.sandbox;
        const local = sandboxConfig['fileReplacements'][0]['with'];
        const localSandbox = tree.read(local)!.toString('utf-8');
        const localB2CPath = local.replace(
          'environment.sandbox.ts',
          'environment.b2c.ts'
        );

        const localDevPath = local.replace(
          'environment.sandbox.ts',
          'environment.dev.ts'
        );
        
        if (tree.exists(localB2CPath)) {
          tree.delete(localB2CPath);
        }

        if (tree.exists(localDevPath)) {
          tree.delete(localDevPath);
        }

        projectsKeys.push(`      - ${project}`);
        tree.create(localB2CPath, localSandbox);
        tree.create(localDevPath, localSandbox);
        // script para adicionar no angular.json
        projects[project].architect.build.configurations['b2c'] = {
          ...sandboxConfig,
          fileReplacements: [
            {
              replace: sandboxConfig['fileReplacements'][0]['replace'],
              with: local.replace(
                'environment.sandbox.ts',
                'environment.b2c.ts'
              ),
            },
          ],
        };

        projects[project].architect.build.configurations['dev'] = {
          ...sandboxConfig,
          fileReplacements: [
            {
              replace: sandboxConfig['fileReplacements'][0]['replace'],
              with: local.replace(
                'environment.sandbox.ts',
                'environment.dev.ts'
              ),
            },
          ],
        };
      }
    }

    const newAngular = {
      ...packageJsonObject,
      projects: projects,
    };

    if (projectsKeys.length > 0) {
      context.logger.info('Trocando pipeline de build para b2c');

      /// pegando novo template de pipeline
      let textPipeline = tree.read(`azure-pipelines.yml`)!.toString('utf-8');
      if (textPipeline) {
        const templateModules = projectsKeys.join('');
        // eslint-disable-next-line no-debugger
        textPipeline = textPipeline
          .replace(/<%= PROJECTS_NAMES%>/g, templateModules)
          .replace(/<%= PRODUCT_NAME%>/g, options.produtoDigital);

        tree.overwrite(`azure-pipelines.yml`, textPipeline);
      }
    }

    tree.overwrite(`angular.json`, JSON.stringify(newAngular, null, 2));
    return tree;
  };
}

export default function (options: OptionsDefaultModule): Rule {
  return () => {
    const templateSource = apply(url('./root-files'), [move('/')]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addStepb2c(options),
    ]);
  };
}
