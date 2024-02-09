import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module',
  template: `
    <ng-container *ngIf="widget>
      <app-module-widget/>
    </ng-container>
    <ng-container *ngIf="!widget>
      <router-outlet></router-outlet>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements AfterViewInit {
  @Input() widget = false
  @Input() currentPath!: string;
  @Output() appOutput = new EventEmitter();

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    if(!this.widget) {
      connectRouter(this.router);
    }
  }
}
