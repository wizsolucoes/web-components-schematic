# Guia de Manutenção e Testes Locais

Este documento explica como fazer manutenção e testar o `@wizco/schematics-webcomponents` localmente usando `npm link`.

## Pré-requisitos

- Node.js instalado
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)
- Um projeto Angular versão 20 limpo para testes (criado em outra pasta)

## Estrutura do Projeto

```
web-components-schematic/
├── application-webcomponents/    # Pacote do schematic (onde você trabalha)
│   ├── src/
│   │   ├── collection.json      # Configuração dos schematics
│   │   └── ...                   # Código fonte dos schematics
│   └── package.json
└── package.json                  # Projeto raiz (Angular de teste)
```

## Setup Inicial

### 1. Criar um Projeto Angular 20 para Testes

Em uma pasta diferente (ex: `~/projetos/99-laboratorio/my-pp`):

```bash
ng new my-pp --version=20
cd my-pp
```

> **Importante:** Use uma pasta completamente separada do projeto do schematic para evitar conflitos.

### 2. Preparar o Schematic para Testes Externos

No projeto `web-components-schematic`:

```bash
cd /caminho/para/web-components-schematic
npm run schematics:prepare-external
```

Este comando executa:
- `schematics:build` - Compila o TypeScript do schematic
- `schematics:link` - Cria o link local do pacote

### 3. Linkar no Projeto de Teste

No projeto Angular de teste:

```bash
cd /caminho/para/my-pp
npm link @wizco/schematics-webcomponents
```

Verifique se o link foi criado corretamente:

```bash
npm list @wizco/schematics-webcomponents
```

Você deve ver algo como:
```
└── @wizco/schematics-webcomponents@20.0.0 extraneous -> ./../../01-wiz/01-core/web-components-schematic/application-webcomponents
```

## Fluxo de Trabalho para Manutenção

### 1. Fazer Alterações

Edite os arquivos na pasta `application-webcomponents/src/` conforme necessário.

### 2. Recompilar o Schematic

Sempre que fizer alterações, você precisa recompilar:

```bash
cd /caminho/para/web-components-schematic
npm run schematics:build
```

> **Nota:** O `npm link` já está ativo, então após o build as mudanças estarão disponíveis automaticamente no projeto de teste.

### 3. Testar no Projeto Angular

No projeto de teste, execute o schematic:

```bash
cd /caminho/para/my-pp
ng g @wizco/schematics-webcomponents:init
```

### 4. Verificar Resultados

Verifique se os arquivos foram gerados corretamente e se o projeto funciona:

```bash
npm start
# ou
ng serve
```

## Comandos Disponíveis do Schematic

Após fazer o link, você pode usar os seguintes comandos no projeto de teste:

```bash
# Inicialização do projeto
ng g @wizco/schematics-webcomponents:init

# Criar aplicação webcomponent
ng g @wizco/schematics-webcomponents:application

# Adicionar MFE
ng g @wizco/schematics-webcomponents:application-mfe

# Modificador Webpack
ng g @wizco/schematics-webcomponents:application-mfe-final-change

# Adicionar ESLint e Prettier
ng g @wizco/schematics-webcomponents:template-add-eslint-prettier

# Adicionar Pipeline CI
ng g @wizco/schematics-webcomponents:template-pipeline-ci

# Adicionar variáveis de ambiente B2C
ng g @wizco/schematics-webcomponents:env-b2c
```

## Scripts Úteis

### No projeto schematic:

```bash
# Instalar dependências do schematic
npm run schematics:intall

# Build do schematic
npm run schematics:build

# Criar/atualizar link local
npm run schematics:link

# Preparar para testes externos (build + link)
npm run schematics:prepare-external

# Testar localmente no projeto raiz
npm run run:local
```

## Troubleshooting

### O schematic não encontra as mudanças

1. Verifique se fez o build:
   ```bash
   npm run schematics:build
   ```

2. Verifique se o link está ativo:
   ```bash
   cd projeto-teste
   npm list @wizco/schematics-webcomponents
   ```

3. Se necessário, refaça o link:
   ```bash
   # No projeto schematic
   npm run schematics:link
   
   # No projeto de teste
   npm unlink @wizco/schematics-webcomponents
   npm link @wizco/schematics-webcomponents
   ```

### Erro ao executar o schematic

1. Verifique se o projeto de teste é Angular 20:
   ```bash
   ng version
   ```

2. Limpe o cache do Angular CLI:
   ```bash
   ng cache clean
   ```

3. Verifique se há erros de compilação no schematic:
   ```bash
   cd application-webcomponents
   npm run build
   ```

### O link não funciona

1. Verifique se o caminho está correto:
   ```bash
   ls -la node_modules/@wizco/schematics-webcomponents
   ```
   Deve mostrar um symlink (`->`)

2. Se o symlink estiver quebrado, refaça:
   ```bash
   # No projeto de teste
   npm unlink @wizco/schematics-webcomponents
   npm link @wizco/schematics-webcomponents
   ```

## Finalizando os Testes

Quando terminar de testar, você pode desfazer o link:

```bash
cd /caminho/para/my-pp
npm unlink @wizco/schematics-webcomponents
npm install
```

Isso restaurará as dependências normais do projeto (se houver alguma referência ao pacote no `package.json`).

## Modo Watch (Desenvolvimento Contínuo)

Durante o desenvolvimento, você pode usar o modo watch para recompilar automaticamente após cada mudança:

```bash
cd /caminho/para/web-components-schematic
npm run schematics:watch
```

Deixe este comando rodando em um terminal. Ele recompilará automaticamente sempre que você salvar alterações nos arquivos do schematic.

> **Nota:** Após cada recompilação automática, você pode testar diretamente no projeto de teste sem precisar rodar o build manualmente.

## Dicas

- **Sempre teste em um projeto limpo:** Use um projeto Angular 20 novo para evitar conflitos com configurações existentes
- **Mantenha o projeto de teste separado:** Não crie o projeto de teste dentro da pasta do schematic
- **Faça build após cada mudança:** O TypeScript precisa ser recompilado para que as mudanças sejam refletidas
- **Use watch mode durante desenvolvimento:** Use `npm run schematics:watch` em um terminal separado para rebuild automático
- **Um terminal para watch, outro para testes:** Mantenha o watch rodando e use outro terminal para executar os comandos de teste

## Estrutura de Teste Recomendada

```
projetos/
├── 01-wiz/
│   └── 01-core/
│       └── web-components-schematic/    # Projeto do schematic
└── 99-laboratorio-raul/
    └── my-pp/                            # Projeto Angular 20 para testes
```

Mantenha essa separação para evitar problemas com paths e dependências.
