import { Injectable, NgZone } from '@angular/core';
import { WcoEventsType } from './typesEvents';

@Injectable({
  providedIn: 'root'
})
export class WcoEventsService  {
  constructor(private ngZone: NgZone) {}

  private handleEvent(event: CustomEvent) {
    this.ngZone.run(() => {});
  }

  /**
   * @name: monitorEvent
   * @description: Método para monitorar eventos personalizados da Wizpro.
   * @param name WcoEventsType
   */
  public monitorEvent(name: WcoEventsType, callback: (data: any) => void) {
    window.addEventListener('wizpro:' + name as any, (event: CustomEvent) => {
      this.ngZone.run(() => {
        callback(event.detail);
      });
    });
  }

  /**
   * @name: removeEvent
   * @description: Método para remover eventos personalizados da Wizpro.
   * @param name WcoEventsType
   */
  public removeEvent(name: WcoEventsType) {
    window.removeEventListener('wizpro:' + name as any, this.handleEvent as any);
  }

  /**
   * @name: emitEvent
   * @description: Método para emitir eventos personalizados da Wizpro.
   * @param name WcoEventsType
   * @param data Object<any>
   * @example
   *  this.wcoEventsService.emitEvent('trackPage', { 
   *    total: 10,
   *    rota: 'minha-rota'
   *  });
   */
  emitEvent(name: WcoEventsType, data: any) {
    const event = new CustomEvent('wizpro:' + name, { detail: data });
    window.dispatchEvent(event);
  }



  /**
   * @name: emitTrackEvent
   * @description: Método para emitir eventos de rastreamento com application insights.
   * @param name string  
   * @param data Object<any>
   * @example
   * this.wcoEventsService.emitTrackEvent("termos-de-uso:busca", {busca: textInput})
   */
  emitTrackEvent(name: string, data: any) {
    const event = new CustomEvent('wizpro:track' , { 
      detail: {
        name,
        data
      },
    });
    window.dispatchEvent(event);
  }
}
