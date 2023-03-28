
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


if (existsSync('./projects')) {
  exec('rm -rf ./projects')
}
