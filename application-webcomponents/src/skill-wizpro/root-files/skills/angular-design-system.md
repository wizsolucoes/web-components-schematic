---
name: angular-design-system
description: Use o Design System interno Fênix (UI Kit Fênix) nos projetos Angular. Inclui tokens, cores, tipografia, espaçamento e botões. Regras, definições e exemplos para LLM/IDE.
---

# Angular + Design System Fênix

Este projeto utiliza o **UI Kit Fênix** (Fênix Design System) como design system interno. Os tokens são variáveis CSS com prefixo `--wco-`. Use sempre os tokens em vez de valores fixos (px, hex) para manter consistência e temas.

**Referência:** [Storybook Fênix](https://fenix.wizsolucoes.com.br/)

---

## Tokens

### Regra

Os tokens são as menores peças do Design System Fênix. Eles **gerenciam e armazenam** decisões de interface (espaçamento, cores, tipografia, bordas, sombras etc.) em formato de **variáveis CSS**. Componentes e temas devem consumir apenas esses tokens. Seguir essa padronização permite que design e desenvolvimento compartilhem a mesma nomenclatura e reduz erros entre projeto e implementação.

### Definições – Todos os tokens mapeados

#### Espaçamento

| Token | Descrição |
|-------|-----------|
| `--wco-spacing-none` | 0px |
| `--wco-spacing-quark` | 4px |
| `--wco-spacing-nano` | 8px |
| `--wco-spacing-xxxs` | 12px |
| `--wco-spacing-xxs` | 16px |
| `--wco-spacing-xs` | 24px |
| `--wco-spacing-sm` | 32px |
| `--wco-spacing-md` | 40px |
| `--wco-spacing-lg` | 48px |
| `--wco-spacing-xl` | 56px |
| `--wco-spacing-xxl` | 64px |
| `--wco-spacing-xxxl` | 80px |
| `--wco-spacing-huge` | 120px |

#### Cores

| Token | Descrição |
|-------|-----------|
| `--wco-color-primary-50` | #fff0e4 |
| `--wco-color-primary-100` | #ffb578 |
| `--wco-color-primary-300` | #ff8826 |
| `--wco-color-primary-500` | #fa780c |
| `--wco-color-primary-600` | #bf5600 |
| `--wco-color-primary-700` | #8f4000 |
| `--wco-color-primary-900` | #301600 |
| `--wco-color-secondary-50` | #ecdff0 |
| `--wco-color-secondary-100` | #c69ed3 |
| `--wco-color-secondary-300` | #aa6ebc |
| `--wco-color-secondary-500` | #a05eb5 |
| `--wco-color-secondary-600` | #844597 |
| `--wco-color-secondary-700` | #633471 |
| `--wco-color-secondary-900` | #42234b |
| `--wco-color-neutral-50` | #FCFCFC |
| `--wco-color-neutral-100` | #E9EBEC |
| `--wco-color-neutral-300` | #C3C8CC |
| `--wco-color-neutral-500` | #8D9399 |
| `--wco-color-neutral-600` | #6D747A |
| `--wco-color-neutral-700` | #50555A |
| `--wco-color-neutral-900` | #080809 |
| `--wco-color-bg` | #EEEBEF |
| `--wco-color-panel` | #FCFCFC |
| `--wco-color-success-50` a `-900` | Verde (sucesso) |
| `--wco-color-warning-50` a `-900` | Amarelo/laranja (aviso) |
| `--wco-color-danger-50` a `-900` | Vermelho (erro) |
| `--wco-color-info-50` a `-900` | Azul (informativo) |

#### Tipografia

| Token | Descrição |
|-------|-----------|
| `--wco-font-family` | 'Figtree', sans-serif |
| `--wco-font-size-xxxs` | 12px |
| `--wco-font-size-xxs` | 14px |
| `--wco-font-size-xs` | 16px |
| `--wco-font-size-sm` | 18px |
| `--wco-font-size-md` | 20px |
| `--wco-font-size-lg` | 24px |
| `--wco-font-size-xl` | 32px |
| `--wco-font-size-xxl` | 36px |
| `--wco-font-size-xxxl` | 48px |
| `--wco-font-size-huge` | 64px |
| `--wco-font-lineheight-tight` | 100% |
| `--wco-font-lineheight-500` | 150% |
| `--wco-font-lineheight-distant` | 170% |
| `--wco-font-lineheight-super-distant` | 180% |
| `--wco-font-lineheight-faraway` | 200% |
| `--wco-font-weight-300` | 300 |
| `--wco-font-weight-regular` | 400 |
| `--wco-font-weight-500` | 500 |
| `--wco-font-weight-bold` | 700 |
| `--wco-font-weight-black` | 900 |

#### Bordas

| Token | Descrição |
|-------|-----------|
| `--wco-radius-none` | 0px |
| `--wco-radius-sm` | 4px |
| `--wco-radius-md` | 8px |
| `--wco-radius-lg` | 24px |
| `--wco-radius-pill` | 500px |
| `--wco-radius-circular` | 50% |
| `--wco-borderwidth-none` | 0px |
| `--wco-borderwidth-hairline` | 0.5px |
| `--wco-borderwidth-thin` | 1px |
| `--wco-borderwidth-thick` | 2px |

#### Opacidade

| Token | Descrição |
|-------|-----------|
| `--wco-opacity-semi-transparent` | 16% |
| `--wco-opacity-100` | 20% |
| `--wco-opacity-500` | 32% |

#### Sombra

| Token | Descrição |
|-------|-----------|
| `--wco-shadow-level-0` | 0px 0px 0px 0px rgba(0, 0, 0, 0.2) |
| `--wco-shadow-level-1` | 0px 2px 16px 0px rgba(0, 0, 0, 0.2) |
| `--wco-shadow-level-2` | 0px 4px 16px 0px rgba(0, 0, 0, 0.2) |
| `--wco-shadow-level-3` | 0px 16px 32px rgba(0, 0, 0, 0.2) |

#### Iconografia

| Token | Descrição |
|-------|-----------|
| `--wco-iconography-size-xxs` | 16px |
| `--wco-iconography-size-xs` | 20px |
| `--wco-iconography-size-sm` | 24px |
| `--wco-iconography-size-md` | 28px |
| `--wco-iconography-size-lg` | 32px |
| `--wco-iconography-size-xl` | 48px |
| `--wco-iconography-size-xxl` | 64px |

### Exemplo – Uso em CSS

Sempre use `var(--wco-*)` nos estilos. Os tokens devem estar definidos em `:root` (ou tema) no projeto:

```css
.meu-componente {
  font-family: var(--wco-font-family);
  font-size: var(--wco-font-size-md);
  color: var(--wco-color-neutral-900);
  padding: var(--wco-spacing-sm);
  border-radius: var(--wco-radius-md);
  box-shadow: var(--wco-shadow-level-1);
}
```

---

## Cores

Use apenas os tokens de cor `--wco-color-*`. Não defina cores com hex/rgb direto no componente. **Primary / Secondary** para ações e identidade; **Neutral** para textos, fundos e bordas (`--wco-color-bg`, `--wco-color-panel`); **Semânticas** (`success`, `warning`, `danger`, `info`) para feedback.

---

## Tipografia

### Regra

A tipografia engloba elementos de composição de texto: fontes, tamanhos, espaçamentos, cores e alinhamentos. No Fênix usa-se tipografia em **CSS puro e tokens**, independente de framework. É necessário ter o pacote `@wizco/fenixds-core` instalado. Use as **classes** diretamente no HTML ou os **tokens** em estilos `.scss`/`.css`.

### Definições – Classes de display

Adicione a classe `.display-[variação]` no elemento desejado:

| Classe | Uso |
|--------|-----|
| `.display-1` | h1 |
| `.display-2` | h2 |
| `.display-3` | h3 |
| `.display-4` | h4 |
| `.display-5` | h5 |
| `.display-6` | h6 |
| `.display-body` | body01 |
| `.display-p` | body02 |
| `.display-text` | body03 |
| `.display-caption` | span / legenda |

### Definições – Tokens de tamanho (CSS / Figma)

| Nome | Valor | Token CSS |
|------|--------|-----------|
| huge | 64px | `--wco-font-size-huge` |
| xxxl | 48px | `--wco-font-size-xxxl` |
| xxl | 36px | `--wco-font-size-xxl` |
| xl | 32px | `--wco-font-size-xl` |
| lg | 24px | `--wco-font-size-lg` |
| md | 20px | `--wco-font-size-md` |
| sm | 18px | `--wco-font-size-sm` |
| xs | 16px | `--wco-font-size-xs` |
| xxs | 14px | `--wco-font-size-xxs` |
| xxxs | 12px | `--wco-font-size-xxxs` |

Fonte: `var(--wco-font-family)` → `'Figtree', sans-serif`. Line-height e peso: `--wco-font-lineheight-*`, `--wco-font-weight-*`.

### Exemplo

```html
<h1 class="display-1">Título principal</h1>
<p class="display-body">Corpo de texto.</p>
<span class="display-caption">Legenda</span>
```

```css
.titulo-custom {
  font-family: var(--wco-font-family);
  font-size: var(--wco-font-size-lg);
  font-weight: var(--wco-font-weight-bold);
  line-height: var(--wco-font-lineheight-500);
}
```

---

## Espaçamento

### Regra

Espaçamentos são aplicados em **margens** e **padding** entre elementos, componentes e layout. Uma escala bem definida traz consistência e deixa a interface mais intuitiva. Use as **classes helper** abaixo (copie e cole a classe que atender ao caso) ou os tokens `--wco-spacing-*` em CSS.

### Definições – Padrão das classes

Formato: **`[p|m][l|r|t|b|y|x|-][tamanho]`**

- **p** = padding | **m** = margin  
- **l** = left | **r** = right | **t** = top | **b** = bottom | **y** = top+bottom | **x** = left+right | **-** (sozinho) = todos os lados  
- **tamanho**: `none`, `quark`, `nano`, `xxxs`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `huge`

### Classes helper – Margem

| Classe | Token | Valor |
|--------|--------|--------|
| `.m-none` a `.m-huge` | margin todos os lados | 0px a 120px |
| `.mt-none` a `.mt-huge` | margin-top | |
| `.mb-none` a `.mb-huge` | margin-bottom | |
| `.ml-none` a `.ml-huge` | margin-left | |
| `.mr-none` a `.mr-huge` | margin-right | |
| `.my-none` a `.my-huge` | margin top + bottom | |
| `.mx-none` a `.mx-huge` | margin left + right | |

### Classes helper – Padding

| Classe | Token | Valor |
|--------|--------|--------|
| `.p-none` a `.p-huge` | padding todos os lados | 0px a 120px |
| `.pt-none` a `.pt-huge` | padding-top | |
| `.pb-none` a `.pb-huge` | padding-bottom | |
| `.pl-none` a `.pl-huge` | padding-left | |
| `.pr-none` a `.pr-huge` | padding-right | |
| `.py-none` a `.py-huge` | padding top + bottom | |
| `.px-none` a `.px-huge` | padding left + right | |

Tamanhos: `none` (0px), `quark` (4px), `nano` (8px), `xxxs` (12px), `xxs` (16px), `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px), `xxl` (64px), `xxxl` (80px), `huge` (120px).

### Exemplo

```html
<div class="mt-sm p-md">Bloco com margin-top 32px e padding 40px</div>
<section class="py-xs px-lg">Seção com padding vertical 24px e horizontal 48px</section>
```

```css
.card {
  padding: var(--wco-spacing-sm);
  margin-bottom: var(--wco-spacing-xs);
}
```

---

## Botões

### Regra

Botões comunicam **chamadas para ação** e permitem interação com a página. Use a tag `<button type="button">` ou `<a>` com a classe base **`.wco-btn`** e combine com as classes de cor, tamanho e variante abaixo. Apenas CSS e HTML.

### Definições – Cores / Variantes

| Classe | Uso |
|--------|-----|
| `.btn-primary` | Ação primária |
| `.btn-secondary` | Ação secundária |
| `.btn-link` | Estilo link |

### Definições – Tamanhos e layout

| Classe | Uso |
|--------|-----|
| `.btn-sm` | Botão pequeno |
| `.btn-md` | Botão médio |
| `.btn-full` | Largura total (100%) |

### Definições – Estilo e estado

| Classe | Uso |
|--------|-----|
| `.btn-outline` | Borda com fundo transparente |
| `.btn-basic` | Fundo transparente, sem borda |
| `.btn-loading` | Estado de carregamento |
| `.btn-icon` | Botão apenas com ícone (use com acessibilidade: `alt`, `title`, `role`) |
| `.btn-notification` | Badge de notificação no botão |

### Exemplos

```html
<button class="wco-btn btn-primary">Meu botão</button>
<button class="wco-btn btn-primary btn-sm">Pequeno</button>
<button class="wco-btn btn-primary btn-full">Largura total</button>
<button class="wco-btn btn-primary btn-outline">Outline</button>
<button class="wco-btn btn-primary btn-basic">Basic</button>
<button class="wco-btn btn-primary btn-loading">Loading</button>
```

Botão com ícone (ex.: Material Icons): coloque o ícone antes ou depois do texto dentro do botão.

```html
<button class="wco-btn btn-primary">
  Botão
  <span class="material-icons">star</span>
</button>
```

Botão apenas ícone (acessibilidade: `title`, `aria-label` ou `role`):

```html
<button class="wco-btn btn-primary btn-outline btn-icon" title="Configurações">
  <span class="material-icons">settings</span>
</button>
```

Botão com notificação:

```html
<button class="wco-btn btn-primary btn-notification">Botão</button>
```

---

**Fonte:** Fênix Design System – `src/stories/tokens/introducao-tokens.docs.mdx`, `src/stories/core/typography.mdx`, `src/stories/core/espacamento/`, `src/stories/UI/buttons/buttons.docs.mdx`. Storybook: [fenix.wizsolucoes.com.br](https://fenix.wizsolucoes.com.br/).
