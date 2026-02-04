---
name: angular-routing
description: Implemente roteamento em aplicações Angular v20+ com lazy loading, guards funcionais, resolvers e parâmetros de rota. Use para configuração de navegação, rotas protegidas, carregamento de dados por rota e roteamento aninhado. Dispara em configuração de rotas, guards de autenticação, lazy loading ou leitura de parâmetros com signals.
---

# Angular Routing

Configure roteamento no Angular v20+ com lazy loading, guards funcionais e parâmetros de rota baseados em signals.

## Configuração básica

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: '**', component: NotFound },
];

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">Home</a>
      <a routerLink="/about" routerLinkActive="active">Sobre</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

## Lazy Loading

Carregue módulos sob demanda:

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.Settings),
  },
];

// admin/admin.routes.ts
export const adminRoutes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'users', component: AdminUsers },
  { path: 'settings', component: AdminSettings },
];
```

## Parâmetros de rota

### Com Signal Inputs (recomendado)

```typescript
{ path: 'users/:id', component: UserDetail }

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  template: `<h1>Usuário {{ id() }}</h1>`,
})
export class UserDetail {
  id = input.required<string>();
  userId = computed(() => parseInt(this.id(), 10));
}
```

Habilite com `withComponentInputBinding()`:

```typescript
import { provideRouter, withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};
```

### Query params

```typescript
// Rota: /search?q=angular&page=1

@Component({...})
export class Search {
  q = input<string>('');
  page = input<string>('1');
  currentPage = computed(() => parseInt(this.page(), 10));
}
```

### Com ActivatedRoute (alternativa)

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

private route = inject(ActivatedRoute);
id = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))), { initialValue: null });
query = toSignal(this.route.queryParamMap.pipe(map(params => params.get('q'))), { initialValue: '' });
```

## Guards funcionais

### Auth Guard

```typescript
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

// Uso nas rotas
{
  path: 'dashboard',
  component: Dashboard,
  canActivate: [authGuard],
}
```

### Role Guard

```typescript
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(Auth);
    const router = inject(Router);
    const userRole = authService.currentUser()?.role;

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
    return router.createUrlTree(['/unauthorized']);
  };
};

// Uso
{
  path: 'admin',
  component: Admin,
  canActivate: [authGuard, roleGuard(['admin', 'superadmin'])],
}
```

### Can Deactivate Guard

```typescript
export interface CanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivate> = (component) => {
  if (component.canDeactivate()) return true;
  return confirm('Há alterações não salvas. Deseja sair mesmo assim?');
};

// Rota
{
  path: 'edit/:id',
  component: Edit,
  canDeactivate: [unsavedChangesGuard],
}
```

## Resolvers

Pré-carregue dados antes da ativação da rota:

```typescript
import { ResolveFn } from '@angular/router';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(User);
  const id = route.paramMap.get('id')!;
  return userService.getById(id);
};

// Config da rota
{
  path: 'users/:id',
  component: UserDetail,
  resolve: { user: userResolver },
}

// Componente - acesse via input
@Component({...})
export class UserDetail {
  user = input.required<User>();
}
```

## Rotas aninhadas

```typescript
export const routes: Routes = [
  {
    path: 'products',
    component: ProductsLayout,
    children: [
      { path: '', component: ProductList },
      { path: ':id', component: ProductDetail },
      { path: ':id/edit', component: ProductEdit },
    ],
  },
];

@Component({
  imports: [RouterOutlet],
  template: `<h1>Produtos</h1><router-outlet />`,
})
export class ProductsLayout {}
```

## Navegação programática

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';

private router = inject(Router);

goToProducts() {
  this.router.navigate(['/products']);
}
goToProduct(id: string) {
  this.router.navigate(['/products', id]);
}
search(query: string) {
  this.router.navigate(['/search'], { queryParams: { q: query, page: 1 } });
}
goToEdit() {
  this.router.navigate(['edit'], { relativeTo: this.route });
}
replaceUrl() {
  this.router.navigate(['/new-page'], { replaceUrl: true });
}
```

## Dados da rota

```typescript
{
  path: 'admin',
  component: Admin,
  data: { title: 'Painel Admin', roles: ['admin'] },
}

// No componente
title = input<string>();
roles = input<string[]>();
```

Para padrões avançados, veja [angular-skills – angular-routing](https://github.com/analogjs/angular-skills/tree/main/skills/angular-routing) e o repositório [angular-skills](https://github.com/analogjs/angular-skills).
