import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { WcoEventsService } from '../share-events/share-events';


@Injectable({
  providedIn: 'root'
})
export class WcoService {

  constructor(
    private wcoEventsService: WcoEventsService
  ) { }

  connectRouter(router: Router, useHash = false): void {
    let url: string;
    if (!useHash) {
      url = `${location.pathname.substring(1)}${location.search}`;
      router.navigateByUrl(url);
      window.addEventListener('popstate', () => {
        router.navigateByUrl(url);
      });
    } else {
      url = `${location.hash.substring(1)}${location.search}`;
      router.navigateByUrl(url);
      window.addEventListener('hashchange', () => {
        router.navigateByUrl(url);
      });
    }

    router.events
      .pipe(filter((event) => event instanceof ActivationEnd))
      .subscribe((event: any) => {
        const { component = null } = event.snapshot;
        if (component && event.snapshot.data) {
          const { breadcrumb = [] } = event.snapshot.data;
          this.wcoEventsService.emitEvent('trackPage', {
            breadcrumb,
            route: event?._routerState?.url || window.location.pathname,
          });
        }
      });
  }
}
