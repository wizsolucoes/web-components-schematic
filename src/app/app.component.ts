import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sini-module',
  template: `
    <ng-template *ngIf="widget; else app">
      <sini-module-widget/>
    </ng-template>
    <ng-template #app>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnChanges {
  @Input() widget = false
  @Input() currentPath!: string;
  @Output() appOutput = new EventEmitter();

   ngOnChanges(changes: SimpleChanges) {
    if ('currentPath' in changes) {
      this.router.navigateByUrl(
        changes['currentPath'].currentValue as string
      );
    }
  }

  constructor(private router:Router) {
    this.router.initialNavigation();
  }
}
