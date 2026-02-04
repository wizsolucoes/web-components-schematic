/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { join, normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { OptionsDefaultModule } from '../types/options.types';

const DEFAULT_PATHS: Record<string, string[]> = {
  '@app/*': ['src/app/*'],
  '@env/*': ['src/environments/*'],
  '@shared/*': ['src/app/shared/*'],
  '@features/*': ['src/app/features/*'],
  '@core/*': ['src/app/core/*'],
  '@components/*': ['src/app/components/*'],
  '@services/*': ['src/app/services/*'],
  '@utils/*': ['src/app/utils/*'],
};

function stripJsonComments(content: string): string {
  return content.replace(/^\s*\/\*[\s\S]*?\*\/\s*/m, '').replace(/\s*\/\/[^\n]*/g, '').trim();
}

export default function (options: OptionsDefaultModule): Rule {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const projectName = options.name;
    if (!projectName) {
      throw new SchematicsException('A opção "name" do projeto é obrigatória.');
    }

    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new SchematicsException(`Projeto "${projectName}" não encontrado no workspace.`);
    }

    const projectRoot = normalize(project.root ? `${project.root}/` : '');
    const tsconfigPath = join(projectRoot, 'tsconfig.app.json');

    const tsconfigBuffer = host.read(tsconfigPath);
    if (!tsconfigBuffer) {
      throw new SchematicsException(`Arquivo "${tsconfigPath}" não encontrado.`);
    }

    const rawContent = tsconfigBuffer.toString();
    const jsonContent = stripJsonComments(rawContent);
    const tsconfig = JSON.parse(jsonContent) as {
      compilerOptions?: Record<string, unknown>;
      [key: string]: unknown;
    };

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.baseUrl = '.';
    tsconfig.compilerOptions.paths = {
      ...DEFAULT_PATHS,
      ...(tsconfig.compilerOptions.paths as Record<string, string[]>),
    };

    host.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    context.logger.info(`Path aliases adicionados em ${tsconfigPath}`);

    return host;
  };
}
