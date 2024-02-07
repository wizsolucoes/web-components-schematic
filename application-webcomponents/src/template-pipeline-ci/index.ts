/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  apply,
  mergeWith,
  chain,
  move, 
  Rule, 
  SchematicContext, 
  Tree, 
  url,
  MergeStrategy,

} from '@angular-devkit/schematics';




function addPipelineDefault(name: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adicionando o pipeline default...');
    let textPipeline = tree.read(`azure-pipelines.yml`)!.toString('utf-8');

    if (!!textPipeline) {
      textPipeline = textPipeline.replace(/<%= folderName%>/g, name);
    }

    tree.overwrite(`azure-pipelines.yml` , textPipeline);

    return tree
  };
}

export default function (options: { port: string, name: string, materialuser: boolean, prefix: string }): Rule {
  
  return () => {
    const templateSource = apply(url('./root-files'), [
      move('/')
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addPipelineDefault(options.name)
    ]);
  };
}
