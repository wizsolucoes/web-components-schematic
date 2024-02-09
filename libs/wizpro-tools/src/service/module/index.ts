import { ActivationEnd, Router  } from '@angular/router';
import { filter } from 'rxjs';


export function connectRouter(router: Router, useHash = false): void {
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

  router.events.pipe(filter(event => event instanceof ActivationEnd)).subscribe((event: any) => {
    const { component = null } = event.snapshot;
    if(component && event.snapshot.data) {
      const { breadcrumb = [] } = event.snapshot.data;
      window.dispatchEvent(new CustomEvent('wizpro:page', { detail: { 
        breadcrumb,
        route: event?._routerState?.url || window.location.pathname
      }}));
    }
  });
}
