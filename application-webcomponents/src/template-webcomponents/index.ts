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
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as ComponentOptions } from '@schematics/angular/component/schema';
import { relativePathToWorkspaceRoot } from '@schematics/angular/utility/paths';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { Builders, ProjectType } from '@schematics/angular/utility/workspace-models';

function addScripts(option: ApplicationOptions): Rule {
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
    scripts['extra:build'] = `ng build --project ${projectName} --output-hashing none --aot --build-optimizer`;
    scripts['extra:build:staging'] = `ng build --configuration=staging --project ${projectName} --output-hashing none --aot --build-optimizer`;
    
    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function addAppToWorkspaceFile(
  options: ApplicationOptions,
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

  if (options.skipTests || options.minimal) {
    const schematicsWithTests = [
      'class',
      'component',
      'directive',
      'guard',
      'interceptor',
      'pipe',
      'resolver',
      'service',
    ];

    schematicsWithTests.forEach((type) => {
      if (!(`@schematics/angular:${type}` in schematics)) {
        schematics[`@schematics/angular:${type}`] = {};
      }
      (schematics[`@schematics/angular:${type}`] as JsonObject).skipTests = true;
    });
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

  const inlineStyleLanguage = options?.style !== Style.Css ? options.style : undefined;

  const project = {
    root: normalize(projectRoot),
    sourceRoot,
    projectType: ProjectType.Application,
    prefix: options.prefix || 'app',
    schematics,
    targets: {
      build: {
        builder: "ngx-build-plus:browser",
        defaultConfiguration: 'production',
        options: {
          outputPath: `dist/${folderName}`,
          index: `${sourceRoot}/index.html`,
          main: `${sourceRoot}/main.ts`,
          polyfills: `${sourceRoot}/polyfills.ts`,
          tsConfig: `${projectRoot}tsconfig.app.json`,
          inlineStyleLanguage,
          assets: [
            `${sourceRoot}/favicon.ico`,
            `${sourceRoot}/assets`
          ],
          styles: [
            `${sourceRoot}/styles.${options.style}`
          ],
          scripts: [],
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
        },
      },
      serve: {
        builder: 'ngx-build-plus:dev-server',
        defaultConfiguration: 'development',
        options: {
          port: 5300,
          publicHost: "http://localhost:5300",
          extraWebpackConfig: `${options.name}/webpack.config.js`
        },
        configurations: {
          production: {
            browserTarget: `${options.name}:build:production`,
            extraWebpackConfig: `${options.name}/webpack.prod.config.js`
          },
          development: {
            browserTarget: `${options.name}:build:development`,
          },
        },
      },
      'extract-i18n': {
        builder: Builders.ExtractI18n,
        options: {
          browserTarget: `${options.name}:build`,
        },
      },
      test: options.minimal
        ? undefined
        : {
            builder: "ngx-build-plus:karma",
            options: {
              main: `${sourceRoot}/test.ts`,
              polyfills: `${sourceRoot}/polyfills.ts`,
              tsConfig: `${projectRoot}tsconfig.spec.json`,
              karmaConfig: `${projectRoot}karma.conf.js`,
              inlineStyleLanguage,
              assets: [
                `${sourceRoot}/favicon.ico`,
                `${sourceRoot}/assets`
              ],
              styles: [
                `src/styles.${options.style}`
              ],
              scripts: [],
            },
          },
    },
  };

  return updateWorkspace((workspace) => {
    workspace.projects.add({
      name: options.name,
      ...project,
    });
  });
}

function minimalPathFilter(path: string): boolean {
  const toRemoveList = /(test.ts|tsconfig.spec.json|karma.conf.js).template$/;

  return !toRemoveList.test(path);
}


export default function (options: ApplicationOptions): Rule {
  return async (host: Tree) => {
    const appRootSelector = `${options.prefix}-module`;
    const componentOptions: Partial<ComponentOptions> = !options.minimal
      ? {
          inlineStyle: options.inlineStyle,
          inlineTemplate: options.inlineTemplate,
          skipTests: options.skipTests,
          style: options.style,
          viewEncapsulation: options.viewEncapsulation,
        }
      : {
          inlineStyle: options.inlineStyle ?? true,
          inlineTemplate: options.inlineTemplate ?? true,
          skipTests: true,
          style: options.style,
          viewEncapsulation: options.viewEncapsulation,
        };

    const workspace = await getWorkspace(host);
    const newProjectRoot = (workspace.extensions.newProjectRoot as string | undefined) || '';
    const isRootApp = options.projectRoot !== undefined;

    // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
    let folderName = options.name.startsWith('@') ? options.name.slice(1) : options.name;
    if (/[A-Z]/.test(folderName)) {
      folderName = strings.dasherize(folderName);
    }

    const appDir = isRootApp
      ? normalize(options.projectRoot || '')
      : join(normalize(newProjectRoot), folderName);
    const sourceDir = `${appDir}/src/app`;

    return chain([
      addScripts(options),
      addAppToWorkspaceFile(options, appDir, folderName),
      mergeWith(
        apply(url('./files'), [
          options.minimal ? filter(minimalPathFilter) : noop(),
          applyTemplates({
            utils: strings,
            ...options,
            relativePathToWorkspaceRoot: relativePathToWorkspaceRoot(appDir),
            appName: options.name,
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
          componentOptions.skipTests
            ? filter((path) => !path.endsWith('.spec.ts.template'))
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
    ]);
  };
}
