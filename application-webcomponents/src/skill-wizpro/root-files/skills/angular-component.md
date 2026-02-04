---
name: angular-component
description: Crie componentes standalone Angular seguindo boas práticas v20+. Use para componentes de UI com inputs/outputs baseados em signals, detecção de mudança OnPush, host bindings, projeção de conteúdo e lifecycle hooks. Dispara em criação de componentes, refatoração de inputs para signals, host bindings ou componentes interativos acessíveis.
---

# Angular Component

Crie componentes standalone para Angular v20+. Componentes são standalone por padrão — não defina `standalone: true`.

## Estrutura do componente

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-card',
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
  },
  template: `
    <img [src]="avatarUrl()" [alt]="name() + ' avatar'" />
    <h2>{{ name() }}</h2>
    @if (showEmail()) {
      <p>{{ email() }}</p>
    }
  `,
  styles: `
    :host { display: block; }
    :host.active { border: 2px solid blue; }
  `,
})
export class UserCard {
  name = input.required<string>();
  email = input<string>('');
  showEmail = input(false);
  isActive = input(false, { transform: booleanAttribute });

  avatarUrl = computed(() => `https://api.example.com/avatar/${this.name()}`);

  selected = output<string>();

  handleClick() {
    this.selected.emit(this.name());
  }
}
```

## Signal Inputs

```typescript
name = input.required<string>();
count = input(0);
label = input<string>();
size = input('medium', { alias: 'buttonSize' });
disabled = input(false, { transform: booleanAttribute });
value = input(0, { transform: numberAttribute });
```

## Signal Outputs

```typescript
import { output, outputFromObservable } from '@angular/core';

clicked = output<void>();
selected = output<Item>();
valueChange = output<number>({ alias: 'change' });

scroll$ = new Subject<number>();
scrolled = outputFromObservable(this.scroll$);

this.clicked.emit();
this.selected.emit(item);
```

## Host Bindings

Use o objeto `host` em `@Component` — não use `@HostBinding` nem `@HostListener`.

```typescript
@Component({
  selector: 'app-button',
  host: {
    'role': 'button',
    '[class.primary]': 'variant() === "primary"',
    '[class.disabled]': 'disabled()',
    '[style.--btn-color]': 'color()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onClick($event)',
    '(keydown.space)': 'onClick($event)',
  },
  template: `<ng-content />`,
})
export class Button {
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input(false, { transform: booleanAttribute });
  color = input('#007bff');
  clicked = output<void>();

  onClick(event: Event) {
    if (!this.disabled()) this.clicked.emit();
  }
}
```

## Projeção de conteúdo

```typescript
@Component({
  selector: 'app-card',
  template: `
    <header><ng-content select="[card-header]" /></header>
    <main><ng-content /></main>
    <footer><ng-content select="[card-footer]" /></footer>
  `,
})
export class Card {}

// Uso:
// <app-card>
//   <h2 card-header>Título</h2>
//   <p>Conteúdo principal</p>
//   <button card-footer>Ação</button>
// </app-card>
```

## Lifecycle Hooks

```typescript
import { OnDestroy, OnInit, afterNextRender, afterRender } from '@angular/core';

export class My implements OnInit, OnDestroy {
  constructor() {
    afterNextRender(() => { /* executa uma vez após o primeiro render */ });
    afterRender(() => { /* executa após cada render */ });
  }

  ngOnInit() { /* componente inicializado */ }
  ngOnDestroy() { /* limpeza */ }
}
```

## Acessibilidade

Componentes devem:
- Passar em verificações AXE
- Atender WCAG AA
- Incluir atributos ARIA adequados em elementos interativos
- Suportar navegação por teclado
- Manter indicadores de foco visíveis

```typescript
@Component({
  selector: 'app-toggle',
  host: {
    'role': 'switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-label]': 'label()',
    'tabindex': '0',
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': 'toggle(); $event.preventDefault()',
  },
  template: `<span class="toggle-track"><span class="toggle-thumb"></span></span>`,
})
export class Toggle {
  label = input.required<string>();
  checked = input(false, { transform: booleanAttribute });
  checkedChange = output<boolean>();

  toggle() {
    this.checkedChange.emit(!this.checked());
  }
}
```

## Sintaxe de template

Use fluxo de controle nativo — não use `*ngIf`, `*ngFor`, `*ngSwitch`.

```html
@if (isLoading()) {
  <app-spinner />
} @else if (error()) {
  <app-error [message]="error()" />
} @else {
  <app-content [data]="data()" />
}

@for (item of items(); track item.id) {
  <app-item [item]="item" />
} @empty {
  <p>Nenhum item encontrado</p>
}

@switch (status()) {
  @case ('pending') { <span>Pendente</span> }
  @case ('active') { <span>Ativo</span> }
  @default { <span>Desconhecido</span> }
}
```

## Classes e estilos

Não use `ngClass` nem `ngStyle`. Use bindings diretos:

```html
<div [class.active]="isActive()">Classe única</div>
<div [class]="classString()">String de classes</div>
<div [style.color]="textColor()">Texto estilizado</div>
<div [style.width.px]="width()">Com unidade</div>
```

## Imagens

Use `NgOptimizedImage` para imagens estáticas:

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="/assets/hero.jpg" width="800" height="600" priority />
    <img [ngSrc]="imageUrl()" width="200" height="200" />
  `,
})
export class Hero {
  imageUrl = input.required<string>();
}
```

Para padrões detalhados, veja [angular-skills – angular-component](https://github.com/analogjs/angular-skills/tree/main/skills/angular-component) e o repositório [angular-skills](https://github.com/analogjs/angular-skills).
