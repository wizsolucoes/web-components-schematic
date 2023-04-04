# angular schematics web components
Este é um *Schematic* para gerar um projeto com *Web Components* utilizando o *Angular*.

___

![](https://raw.githubusercontent.com/raulmelo/web-components-schematic/master/docs/Thumbnail.jpg)
___ 

IMPORTANTE: Este esquema supõe que você esteja usando uma aplicação com o padrão da Wiz. Caso não esteja, será necessário alterar algumas informações.

## Instalação
Para instalar o esquema, execute o comando abaixo no seu terminal.

```bash
npm i @wizco/schematics-webcomponents --save-dev --legacy-peer-deps
```

## Como usar
Execute o comando no seu terminal. 

```bash
ng g @wizco/schematics-webcomponents:init NOME -p ELEMENTO_TAG
```
> Substitua o parâmetro NOME e ELEMENTO_TAG pelo valor de sua escolha.

| Parâmetro | Descrição | exemplo | | 
| --- | --- | --- | --- |
| NOME | Nome do projeto | usuarios | projects/usuarios |
| ELEMENTO_TAG | Nome do elemento | usuarios | `<wc-usuarios-modules></wc-usuarios-modules>` | 

___

![](https://github.com/raulmelo/web-components-schematic/blob/master/docs/termina-comands.jpg?raw=true)
___ 

## O que é gerado
O esquema irá gerar um projeto com a seguinte estrutura:

```bash
├── src/
│   ├── projects/
│   │   ├── NOME/
```

O pacote também ira adiciona os  scripts para build em produção e staging.

````json
scripts: {
  "extra:build:": "ng build --project NOME",
  "extra:build:staging": "ng build --configuration=staging"
}
````


Os scripts podem ser executados com os seguintes comandos:
  
```bash 
# Produção
npm run build:web-component

# Homologação
npm run build:web-component:staging
```


## Contruibuição
Para contribuir com o projeto, siga os passos abaixo:

Clone o repositório e instale as dependências.

Leia o [guia para rodar local](./README_LOCAL.md) para saber como contribuir com o projeto.

Abra um pull request e envia as alterações.
