
import { exec } from 'child_process';
import { copyFile, existsSync, unlink } from 'fs';

if (existsSync('./angular.json')) {
  unlink('./angular.json', (err) => {
    if (err) throw err;
    console.log('Arquivo excluído com sucesso!');
  });
}
copyFile('./angular.json_template', './angular.json', (err) => {
  if (err) throw err;
  console.log('Arquivo copiado com sucesso!');
});

exec(
  "npm uninstall @wizco/fenixds-core @wizco/fenixds-ngx @wizco/wizpro-tools @angular-architects/module-federation @angular-eslint/schematics @angular/elements @angular/material --force"
);

exec("rm -rf ./src ./webpack.config.js ./webpack.prod.config.js");
if (existsSync('./projects')) {
  exec("rm -rf ./projects");
}


