# Rodando local

A pasta raiz é um projeto angular >15 simples. Nele você pode rodar e testar a estrutura normalmente.

📁 Existe uma pasta chamado ***application-webcomponents***, onde ali esta nosso pacote angular de schematics. **toda mudança do pacote acontece no application-webcomponents/**

### Como eu testo local essas mudanças.

Depois de alterar o que for preciso na pasta ***application-webcomponents***, volte para o repositório **raiz** e rode os seguintes comandos.

```bash
	npm run schematics:intall
```

> Acima estamos instalando as dependências dessa pasta especifica, que schematics do angular esta usando usando. 

```bash 
npm run schematics:build
```
> Acima iremos criar uma build daquele pacote para ser usado nos próximos passos. Ele vai criar uma build do angular schematics.

#### Agora precisamos testar e usar localmente esse build. 
```
 npm link ./application-webcomponents
```
> Agora usamos a o npm link para associar esse pacote NPM com angular nas nossas dependências.

Pronto tudo certo.

Sempre que alterar algum arquivo na pasta ***application-webcomponents***, deve seguir os passos de build e npm link. 

## Vamos usar o pacote gerado.

Na pasta raiz do repositório, onde se encontra um projeto angular simples.  Nele iremos testar e usar nossas mudanças.

```bash 
	ng g application-webcomponents:init
```


Isso é tudo por enquanto.
