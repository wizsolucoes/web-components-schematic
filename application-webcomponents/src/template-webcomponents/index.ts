/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { join, JsonObject, normalize } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain, filter, MergeStrategy, mergeWith,
  move,
  noop, Rule, SchematicContext, SchematicsException, strings, Tree, url
} from '@angular-devkit/schematics';
import { Schema as ComponentOptions, Style } from '@schematics/angular/component/schema';
import { relativePathToWorkspaceRoot } from '@schematics/angular/utility/paths';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { OptionsDefaultModule } from '../types/options.types';



/**
 * 
 * @param option ApplicationOptions
 * @returns Rule
 * @description Adiciona os scripts de build e serve no package.json
 */
function addScripts(option: OptionsDefaultModule): Rule {
  const projectName = option.name || 'module';
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(`Criando script para build. ${projectName}`);
    const packageJsonBuffer = tree.read('package.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());
    const scripts = packageJsonObject.scripts;
    
    scripts['start:module'] = `ng serve --project ${projectName}`;
    scripts['build:module'] = `ng build --project ${projectName} --output-hashing none --aot`;
    scripts['build:module:staging'] = `ng build --configuration staging --project ${projectName} --output-hashing none --aot`;
    scripts['build:module:sandbox'] = `ng build --configuration sandbox --project ${projectName} --output-hashing none --aot`;
    
    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

/**
 * 
 * @returns Rule
 * @description Remove o primeiro projeto padrão do workspace antes de criar o customizado
 */
function removeDefaultProject(): any {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);

    // Pega o primeiro projeto do workspace
    const firstProject = workspace.projects.keys().next();
    
    if (firstProject.value) {
      const firstProjectName = firstProject.value;
      _context.logger.info(`Removendo projeto padrão: ${firstProjectName}`);
      
      await updateWorkspace((workspaceToUpdate) => {
        workspaceToUpdate.projects.delete(firstProjectName);
      })(host, _context as any);
    }

    return host;
  };
}

/**
 * 
 * @param option ApplicationOptions
 * @returns Rule
 * @description Atualiza o arquivo angular.json removendo projetos antigos da raiz
 */
function angularJsonUpdateRoot(options: OptionsDefaultModule): any {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);

    // Coleta os nomes dos projetos a serem deletados
    const projectsToDelete: string[] = [];
    workspace.projects.forEach((project, projectName) => {
      if (project.extensions.projectType === 'application') {
        const valuesConfig = project.targets?.values().next().value;
        if (valuesConfig?.options?.main === 'src/main.ts' && projectName !== options.name) {
          projectsToDelete.push(projectName);
        }
      }
    });

    // Se houver projetos para deletar, atualiza o workspace
    if (projectsToDelete.length > 0) {
      await updateWorkspace((workspaceToUpdate) => {
        projectsToDelete.forEach((projectName) => {
          workspaceToUpdate.projects.delete(projectName);
        });
      })(host, _context as any); 
    }

    return host;
  };
}

/**
 * 
 * @param option ApplicationOptions, appDir string, folderName string
 * @returns Rule
 * @description Adiciona o app no arquivo workspace
 */
function addAppToWorkspaceFile(
  options: OptionsDefaultModule,
  appDir: string,
  folderName: string,
): any {
  let projectRoot = appDir;
  if (projectRoot) {
    projectRoot += '/';
  }

  const schematics: JsonObject = {};

  if (
    options.inlineTemplate ||
    options.inlineStyle ||
    options.minimal ||
    options.style !== Style.Css
  ) {
    const componentSchematicsOptions: JsonObject = {};
    if (options.inlineTemplate ?? options.minimal) {
      componentSchematicsOptions.inlineTemplate = true;
    }
    if (options.inlineStyle ?? options.minimal) {
      componentSchematicsOptions.inlineStyle = true;
    }
    if (options.style && options.style !== Style.Css) {
      componentSchematicsOptions.style = options.style;
    }
    schematics['@schematics/angular:component'] = componentSchematicsOptions;
  }

  const sourceRoot = join(normalize(projectRoot), 'src');
  let budgets = [];
  if (options.strict) {
    budgets = [
      {
        type: 'initial',
        maximumWarning: '500kb',
        maximumError: '2mb',
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '2kb',
        maximumError: '2mb',
      },
    ];
  } else {
    budgets = [
      {
        type: 'initial',
        maximumWarning: '2mb',
        maximumError: '5mb',
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb',
      },
    ];
  }


  const project = {
    root: normalize(projectRoot),
    sourceRoot,
    projectType: ProjectType.Application,
    prefix: options.prefix || 'app',
    schematics,
    architect: {
      build: {
        builder: 'ngx-build-plus:browser',
        defaultConfiguration: 'production',
        options: {
          outputPath: `dist/${folderName}`,
          index: `${sourceRoot}/index.html`,
          main: `${sourceRoot}/main.ts`,
          polyfills: ['zone.js'],
          tsConfig: `${projectRoot}tsconfig.app.json`,
          inlineStyleLanguage: 'scss',
          assets: [`${sourceRoot}/favicon.ico`, `${sourceRoot}/assets`],
          styles: [`${sourceRoot}/styles.${options.style}`],
          scripts: [],
          extraWebpackConfig: 'webpack.config.js',
          commonChunk: false,
        },
        configurations: {
          production: {
            budgets,
            fileReplacements: [
              {
                replace: `${sourceRoot}/environments/environment.ts`,
                with: `${sourceRoot}/environments/environment.prod.ts`,
              },
            ],
            outputHashing: 'all',
            extraWebpackConfig: 'webpack.prod.config.js',
          },
          staging: {
            budgets,
            fileReplacements: [
              {
                replace: `${sourceRoot}/environments/environment.ts`,
                with: `${sourceRoot}/environments/environment.staging.ts`,
              },
            ],
            outputHashing: 'all',
          },
          sandbox: {
            budgets,
            fileReplacements: [
              {
                replace: `${sourceRoot}/environments/environment.ts`,
                with: `${sourceRoot}/environments/environment.sandbox.ts`,
              },
            ],
            outputHashing: 'all',
          },
          development: {
            buildOptimizer: false,
            optimization: false,
            vendorChunk: true,
            extractLicenses: false,
            sourceMap: true,
            namedChunks: true,
          },
          dev: {
            budgets,
            fileReplacements: [
              {
                replace: `${sourceRoot}/environments/environment.ts`,
                with: `${sourceRoot}/environments/environment.dev.ts`,
              },
            ],
            outputHashing: 'all',
          },
        },
      },
      serve: {
        builder: 'ngx-build-plus:dev-server',
        defaultConfiguration: 'development',
        options: {
          port: options.port || 4430,
          publicHost: `http://localhost:${options.port || 4430}`,
          extraWebpackConfig: 'webpack.config.js',
        },
        configurations: {
          production: {
            buildTarget: `${options.name}:build:production`,
            extraWebpackConfig: 'webpack.prod.config.js',
          },
          development: {
            buildTarget: `${options.name}:build:development`,
          },
        },
      },
      lint: {
        builder: '@angular-eslint/builder:lint',
        options: {
          lintFilePatterns: [
            `${sourceRoot}/**/*.ts`,
            `${sourceRoot}/**/*.html`,
          ],
        },
      },
      test: options.minimal
        ? undefined
        : {
            builder: 'ngx-build-plus:karma',
            options: {
              main: `${sourceRoot}/test.ts`,
              polyfills: ['zone.js', 'zone.js/testing'],
              tsConfig: `${projectRoot}tsconfig.spec.json`,
              karmaConfig: `${projectRoot}karma.conf.js`,
              inlineStyleLanguage: 'scss',
              assets: [`${sourceRoot}/favicon.ico`, `${sourceRoot}/assets`],
              styles: [`src/styles.${options.style}`],
              scripts: [],
            },
          },
    },
  };

  return updateWorkspace((workspace) => {
    workspace.projects.add({
      name: options.name,
      ...project,
    } as any);
  });
}

function minimalPathFilter(path: string): boolean {
  const toRemoveList = /(test.ts|tsconfig.spec.json|karma.conf.js).template$/;

  return !toRemoveList.test(path);
}


export default function (options: OptionsDefaultModule): Rule {
  return async () => {
    const appRootSelector = `${options.prefix}-module`;
    const componentOptions: Partial<ComponentOptions> =  { // Deixa o componente com inlineStyle e inlineTemplate
      inlineStyle: false,
      inlineTemplate: false,
      skipTests: true,
      style: Style.Scss,
      viewEncapsulation: options.viewEncapsulation,
      standalone: true
    };

    // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
    let folderName = options.name.startsWith('@') ? options.name.slice(1) : options.name;
    if (/[A-Z]/.test(folderName)) {
      folderName = strings.dasherize(folderName);
    }

    const appDir = normalize(options.projectRoot || '');
    const sourceDir = `${appDir}/src/app`;
    const isRootApp = true;

    return chain([
      /// 
      removeDefaultProject(),
      addScripts(options),
      addAppToWorkspaceFile(options, appDir, folderName),
      mergeWith(
        apply(url('./files'), [
          options.minimal ? filter(minimalPathFilter) : noop(),
          applyTemplates({
            pathPackage: '../package.json',
            utils: strings,
            ...options,
            relativePathToWorkspaceRoot: relativePathToWorkspaceRoot(appDir),
            appName: options.name,
            produtoDigital: options.produtoDigital,
            isRootApp,
            folderName,
          }),
          move(appDir),
        ]),
        MergeStrategy.Overwrite,
      ),
      mergeWith(
        apply(
          url('./other-files'),
          [
          options.strict ? noop() : filter((path) => path !== '/package.json.template'),
          componentOptions.inlineTemplate
            ? filter((path) => !path.endsWith('.html.template'))
            : noop(),
          applyTemplates({
            utils: strings,
            ...options,
            selector: appRootSelector,
            ...componentOptions,
          }),
          move(sourceDir),
        ]),
        MergeStrategy.Overwrite
      ),
      angularJsonUpdateRoot(options)
    ]);
  };
}
