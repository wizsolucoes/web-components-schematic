# angular schematics web components

O *Angular Schematics Web Components* é um Schematic que permite gerar um projeto com *Web Components* utilizando o Angular.
___

![](https://github.com/wizsolucoes/web-components-schematic/blob/master/docs/Thumbnail.jpg)
___ 


## Instalação
Para instalar o esquema, execute o seguinte comando no seu terminal, de acordo com a versão desejada:

```bash
npm i @wizco/schematics-webcomponents --save-dev --legacy-peer-deps
```

## Versionamento

O *Angular Schematics Web Components* segue um esquema de versionamento padrão para facilitar o controle e garantir a compatibilidade adequada.

As versões disponíveis do pacote são:

| Suporte  | Versão |
| ------------- |:-------------:|
| Angular 16      | @wizco/schematics-webcomponents    |
| Angular 14 e 15     | @wizco/schematics-webcomponents@15.0.10 |

Recomendamos usar a versão correspondente ao Angular que você está utilizando em seu projeto. Isso garante que todas as funcionalidades e recursos sejam compatíveis e funcionem corretamente.

## Como usar
Execute o comando no seu terminal. 

```bash
ng g @wizco/schematics-webcomponents:init
```


| Parâmetro | Descrição | exemplo |  | 
| --- | --- | --- | --- |
| nome | Nome do projeto | usuarios | projects/usuarios |
| Tag do elemento | Nome do elemento | usuarios | `<wc-usuarios-modules></wc-usuarios-modules>` |
| porta | porta do modulo  | 4500 | localhost:4500 |  



## Estrutura gerada
O esquema irá gerar um projeto com a seguinte estrutura:

```bash
├── src/
│   ├── projects/
│   │   ├── NOME/
```

Além disso, o pacote também adicionará scripts para a construção em ambiente de produção e staging.

````json
scripts: {
  "run:all": "node node_modules/@angular-architects/module-federation/src/server/mf-dev-server.js",
  "extra:build:": "ng build --project NOME",
  "extra:build:staging": "ng build --configuration=staging"
}
````


Os scripts podem ser executados com os seguintes comandos:
  
```bash 
# Roda local ambos os projetos
npm run run:all

# Produção
npm run extra:build

# Homologação
npm run extra:build:staging
```


## Contruibuição
Para contribuir com o projeto, siga os passos abaixo:
- Clone o repositório e instale as dependências.
- Leia o [guia para rodar local](./README_LOCAL.md) para saber como contribuir com o projeto.
- Abra um pull request e envia as alterações.
