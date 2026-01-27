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
    context.logger.info('Atualizando pipeline do Azure');
    const angularJson = tree.read(`angular.json`)!.toString('utf-8');

    if (!angularJson) {
      throw new SchematicsException('No angular.json file found');
    }

    const packageJsonObject = JSON.parse(angularJson.toString());
    const projects = packageJsonObject.projects;
    const projectsKeys = [];

    // Coleta os nomes dos projetos para o pipeline
    for (const project in projects) {
      if (
        projects[project].projectType === 'application' &&
        projects[project].architect &&
        projects[project].architect.build &&
        projects[project].architect.build.configurations &&
        projects[project].architect.build.configurations.sandbox
      ) {
        projectsKeys.push(`      - ${project}`);
      }
    }

    // Atualiza o pipeline do Azure se houver projetos
    if (projectsKeys.length > 0) {
      context.logger.info('Atualizando pipeline de build');

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
