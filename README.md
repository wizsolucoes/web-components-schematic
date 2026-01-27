# Rodando local

A pasta raiz é um projeto angular >15 simples. Nele você pode rodar e testar a estrutura normalmente.

📁 Existe uma pasta chamado ***application-webcomponents***, onde ali esta nosso pacote angular de schematics. **toda mudança do pacote acontece no application-webcomponents/**

### Como eu testo local essas mudanças.

Depois de alterar o que for preciso na pasta ***application-webcomponents***, volte para o repositório **raiz** e rode os seguintes comandos.

#### Modo simples 
Foi criado um script para seguir todos os passos para testar o fluxo use ele para testes mais rápidos.
```bash
npm run run:local
```

#### Modo manual
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
ng g @wizco/schematics-webcomponents:init
```

## Testando em projetos externos

> 📖 **Guia completo:** Para instruções detalhadas sobre manutenção e testes locais, consulte o arquivo [execute-local.md](./execute-local.md)

Para testar o schematic em outros projetos Angular usando `npm link`:

### Passo 1: Preparar o schematic (no projeto atual)
```bash
npm run schematics:build
npm run schematics:link
```

### Passo 2: Linkar no projeto de teste
No projeto onde você quer testar, execute:
```bash
npm link @wizco/schematics-webcomponents
```

### Passo 3: Usar o schematic
```bash
ng g @wizco/schematics-webcomponents:init
```

### Para desfazer o link (quando terminar os testes)
No projeto de teste:
```bash
npm unlink @wizco/schematics-webcomponents
npm install
```

> **Nota:** Sempre que alterar arquivos na pasta `application-webcomponents`, execute novamente o `schematics:build` e `schematics:link` no projeto atual para que as mudanças sejam refletidas no projeto de teste.

Isso é tudo por enquanto.
