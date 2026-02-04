---
name: angular-signals
description: Implemente gerenciamento de estado reativo baseado em signals no Angular v20+. Use para estado reativo com signal(), estado derivado com computed(), estado dependente com linkedSignal() e efeitos colaterais com effect(). Dispara em questões de estado, migração de BehaviorSubject/Observable para signals ou fluxos reativos.
---

# Angular Signals

Signals são o primitivo reativo do Angular para gerenciamento de estado. Oferecem reatividade síncrona e granular.

## APIs principais

### signal() – Estado gravável

```typescript
import { signal } from '@angular/core';

const count = signal(0);

console.log(count()); // 0
count.set(5);
count.update(c => c + 1);

const user = signal<User | null>(null);
user.set({ id: 1, name: 'Alice' });
```

### computed() – Estado derivado

```typescript
import { signal, computed } from '@angular/core';

const firstName = signal('João');
const lastName = signal('Silva');

const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "João Silva"
firstName.set('Maria');
console.log(fullName()); // "Maria Silva"

const items = signal<Item[]>([]);
const filter = signal('');
const filteredItems = computed(() => {
  const query = filter().toLowerCase();
  return items().filter(item => item.name.toLowerCase().includes(query));
});
const totalPrice = computed(() =>
  filteredItems().reduce((sum, item) => sum + item.price, 0)
);
```

### linkedSignal() – Estado dependente com reset

```typescript
import { signal, linkedSignal } from '@angular/core';

const options = signal(['A', 'B', 'C']);
const selected = linkedSignal(() => options()[0]);

console.log(selected()); // "A"
selected.set('B');
options.set(['X', 'Y']);
console.log(selected()); // "X" – reset para o primeiro
```

### effect() – Efeitos colaterais

```typescript
import { signal, effect } from '@angular/core';

@Component({...})
export class Search {
  query = signal('');

  constructor() {
    effect(() => {
      console.log('Consulta:', this.query());
    });

    effect((onCleanup) => {
      const timer = setInterval(() => console.log(this.query()), 1000);
      onCleanup(() => clearInterval(timer));
    });
  }
}
```

**Regras do effect:** executa em contexto de injeção (constructor ou `runInInjectionContext`); é limpo automaticamente quando o componente é destruído.

## Padrão de estado no componente

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <input [value]="newTodo()" (input)="newTodo.set($any($event.target).value)" />
    <button (click)="addTodo()" [disabled]="!canAdd()">Adicionar</button>
    <ul>
      @for (todo of filteredTodos(); track todo.id) {
        <li [class.done]="todo.done">
          {{ todo.text }}
          <button (click)="toggleTodo(todo.id)">Alternar</button>
        </li>
      }
    </ul>
    <p>{{ remaining() }} restantes</p>
  `,
})
export class TodoList {
  todos = signal<Todo[]>([]);
  newTodo = signal('');
  filter = signal<'all' | 'active' | 'done'>('all');

  canAdd = computed(() => this.newTodo().trim().length > 0);

  filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'active': return todos.filter(t => !t.done);
      case 'done': return todos.filter(t => t.done);
      default: return todos;
    }
  });

  remaining = computed(() => this.todos().filter(t => !t.done).length);

  addTodo() {
    const text = this.newTodo().trim();
    if (text) {
      this.todos.update(todos => [...todos, { id: crypto.randomUUID(), text, done: false }]);
      this.newTodo.set('');
    }
  }

  toggleTodo(id: string) {
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }
}
```

## Interop com RxJS

### toSignal() – Observable para Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

counter = toSignal(interval(1000), { initialValue: 0 });
users = toSignal(this.http.get<User[]>('/api/users'));
currentUser = toSignal(this.user$, { requireSync: true });
```

### toObservable() – Signal para Observable

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs';

results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(300),
    switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`))
  ),
  { initialValue: [] }
);
```

## Igualdade customizada

```typescript
const user = signal<User>(
  { id: 1, name: 'Alice' },
  { equal: (a, b) => a.id === b.id }
);

user.set({ id: 1, name: 'Alice Atualizada' }); // Não dispara
user.set({ id: 2, name: 'Bob' }); // Dispara
```

## Leituras untracked

```typescript
import { untracked } from '@angular/core';

const result = computed(() => {
  const aVal = a();
  const bVal = untracked(() => b());
  return aVal + bVal;
});
```

## Padrão de estado em serviço

```typescript
@Injectable({ providedIn: 'root' })
export class Auth {
  private _user = signal<User | null>(null);
  private _loading = signal(false);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  private http = inject(HttpClient);

  async login(credentials: Credentials): Promise<void> {
    this._loading.set(true);
    try {
      const user = await firstValueFrom(
        this.http.post<User>('/api/login', credentials)
      );
      this._user.set(user);
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this._user.set(null);
  }
}
```

Para padrões avançados incluindo resource(), veja [angular-skills – angular-signals](https://github.com/analogjs/angular-skills/tree/main/skills/angular-signals) e o repositório [angular-skills](https://github.com/analogjs/angular-skills).
