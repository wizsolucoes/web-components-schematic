---
name: angular-forms
description: Construa formulários baseados em signals no Angular v21+ com a API Signal Forms. Use para criação de formulários com binding bidirecional automático, validação por schema, gerenciamento de estado dos campos e formulários dinâmicos. Dispara em implementação de formulários, adição de validação, formulários multi-etapa ou formulários com campos condicionais. Signal Forms são experimentais mas recomendados para novos projetos Angular.
---

# Angular Signal Forms

Construa formulários tipados e reativos usando a API Signal Forms do Angular. Signal Forms oferecem binding bidirecional automático, validação por schema e estado reativo dos campos.

**Nota:** Signal Forms são experimentais no Angular v21. Para apps em produção que exigem estabilidade, veja Reactive Forms no repositório [angular-skills](https://github.com/analogjs/angular-skills).

## Configuração básica

```typescript
import { Component, signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)">
      <label>
        Email
        <input type="email" [formField]="loginForm.email" />
      </label>
      @if (loginForm.email().touched() && loginForm.email().invalid()) {
        <p class="error">{{ loginForm.email().errors()[0].message }}</p>
      }

      <label>
        Senha
        <input type="password" [formField]="loginForm.password" />
      </label>
      @if (loginForm.password().touched() && loginForm.password().invalid()) {
        <p class="error">{{ loginForm.password().errors()[0].message }}</p>
      }

      <button type="submit" [disabled]="loginForm().invalid()">Entrar</button>
    </form>
  `,
})
export class Login {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email é obrigatório' });
    email(schemaPath.email, { message: 'Informe um email válido' });
    required(schemaPath.password, { message: 'Senha é obrigatória' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      const credentials = this.loginModel();
      console.log('Enviando:', credentials);
    }
  }
}
```

## Modelos de formulário

Modelos são signals graváveis que servem como fonte única da verdade:

```typescript
interface UserProfile {
  name: string;
  email: string;
  age: number | null;
  preferences: {
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
}

const userModel = signal<UserProfile>({
  name: '',
  email: '',
  age: null,
  preferences: { newsletter: false, theme: 'light' },
});

const userForm = form(userModel);

userForm.name;
userForm.preferences.theme;
```

### Ler valores

```typescript
const data = this.userModel();
const name = this.userForm.name().value();
const theme = this.userForm.preferences.theme().value();
```

### Atualizar valores

```typescript
this.userModel.set({ name: 'Alice', email: 'alice@exemplo.com', age: 30, preferences: { newsletter: true, theme: 'dark' } });
this.userForm.name().value.set('Bob');
this.userForm.age().value.update(age => (age ?? 0) + 1);
```

## Estado do campo

Cada campo expõe signals reativos para validação, interação e disponibilidade:

```typescript
const emailField = this.form.email();

emailField.valid();
emailField.invalid();
emailField.errors();
emailField.pending();
emailField.touched();
emailField.dirty();
emailField.disabled();
emailField.hidden();
emailField.readonly();
emailField.value();
```

### Estado no nível do formulário

```typescript
this.form().valid();
this.form().touched();
this.form().dirty();
```

## Validação

### Validadores built-in

```typescript
import { form, required, email, min, max, minLength, maxLength, pattern } from '@angular/forms/signals';

const userForm = form(this.userModel, (schemaPath) => {
  required(schemaPath.name, { message: 'Nome é obrigatório' });
  email(schemaPath.email, { message: 'Email inválido' });
  min(schemaPath.age, 18, { message: 'Deve ser 18+' });
  max(schemaPath.age, 120, { message: 'Idade inválida' });
  minLength(schemaPath.password, 8, { message: 'Mínimo 8 caracteres' });
  maxLength(schemaPath.bio, 500, { message: 'Máximo 500 caracteres' });
  pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, { message: 'Formato: 555-123-4567' });
});
```

### Validação condicional

```typescript
required(schemaPath.promoCode, {
  message: 'Código promocional obrigatório para desconto',
  when: ({ valueOf }) => valueOf(schemaPath.applyDiscount),
});
```

### Validadores customizados

```typescript
import { validate } from '@angular/forms/signals';

validate(schemaPath.username, ({ value }) => {
  if (value().includes(' ')) {
    return { kind: 'noSpaces', message: 'Usuário não pode conter espaços' };
  }
  return null;
});
```

### Validação entre campos

```typescript
validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
  if (value() !== valueOf(schemaPath.password)) {
    return { kind: 'mismatch', message: 'As senhas não coincidem' };
  }
  return null;
});
```

## Campos condicionais

```typescript
import { hidden, disabled, readonly } from '@angular/forms/signals';

hidden(schemaPath.publicUrl, ({ valueOf }) => !valueOf(schemaPath.isPublic));
disabled(schemaPath.couponCode, ({ valueOf }) => valueOf(schemaPath.total) < 50);
readonly(schemaPath.username);
```

## Envio do formulário

```typescript
import { submit } from '@angular/forms/signals';

onSubmit(event: Event) {
  event.preventDefault();
  submit(this.form, async () => {
    await this.authService.login(this.model());
  });
}
```

## Arrays e campos dinâmicos

```typescript
applyEach(schemaPath.items, (item) => {
  required(item.product, { message: 'Produto obrigatório' });
  min(item.quantity, 1, { message: 'Quantidade mínima é 1' });
});
```

## Exibir erros

```html
@if (form.email().touched() && form.email().invalid()) {
  <ul class="errors">
    @for (error of form.email().errors(); track error) {
      <li>{{ error.message }}</li>
    }
  </ul>
}
@if (form.email().pending()) {
  <span>Validando...</span>
}
```

## Reset do formulário

```typescript
this.form().reset();
this.model.set({ email: '', password: '' });
```

Para padrões de Reactive Forms (estáveis em produção), veja [angular-skills – angular-forms](https://github.com/analogjs/angular-skills/tree/main/skills/angular-forms) e o repositório [angular-skills](https://github.com/analogjs/angular-skills).
