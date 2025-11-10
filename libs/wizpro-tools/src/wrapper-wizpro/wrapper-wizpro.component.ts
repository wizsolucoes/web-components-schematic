

import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation-runtime';
import { WrapperWizproModule, WrapperWizproOptions } from './wrapper-wizpro-types';
@Component({
  selector: 'wizco-external-module',
  template: `<section [id]="WizProidElement" #vc></section>`,
  standalone: true,
})
export class WrapperWizproComponent implements OnInit, OnDestroy {
  @ViewChild('vc', { read: ElementRef, static: true })
  vc!: ElementRef;
  element!: any;
  WizProidElement!: string;
  error: boolean = false;

  private moduleExternalOptions: WrapperWizproModule = {
    remoteEntry: 'https://modulecoreplatformprdstg.blob.core.windows.net/module-external/remoteEntry.js',
    exposedModule: './web-components',
    elementName: 'wc-module-external',
    type: 'module',
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadindMfe();
  }

  async loadindMfe(): Promise<void> {
    this.error = false;
    const allData: WrapperWizproOptions =
      (this.route.snapshot.data as WrapperWizproOptions) ?? ({} as WrapperWizproOptions);

    const options: WrapperWizproOptions = this.moduleExternalOptions;
      if (options.remoteEntry) {
        try {
          await loadRemoteModule({
            type: options.type as 'module' || 'manifest',
            remoteEntry: options.remoteEntry,
            exposedModule: options.exposedModule,
          });
          this.element = document.createElement(options.elementName);
          this.WizProidElement = options.elementName;
          this.vc.nativeElement.appendChild(this.element);
          this.setElementProps(allData);
        } catch (error) {
          this.error = true;
          console.error(
            'Error ao carregar o módulo:' + options.elementName, error
          );
        }
      }
  }

  ngOnDestroy(): void {
    if (this.element) {
      this.vc.nativeElement.removeChild(this.element);
    }
  }

  /**
   * Repassar router data para o elemento
   * @param data - Router data
   */
  private setElementProps(data: WrapperWizproOptions): void {
    if (!this.element) {
      return;
    }
    // Repassar router data para o elemento
    this.element['options'] = data;
  }
}