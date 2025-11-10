import { UrlMatcher, UrlSegment } from '@angular/router';


/* 
* @description Verifica se a url começa com o prefixo
* @param prefix string
* @returns UrlMatcher
* @example startsWith('wiz')
* @description Esse recurso é utilizado para verificar se a url começa com o prefixo
* @author @angular-architects/module-federation-tools
* @example
* {
*   path: 'wiz',
*   matcher: startsWith('wiz')
* }
*/
export function startsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[]) => {
    const fullUrl = url.map((u) => u.path).join('/');
    if (fullUrl.startsWith(prefix)) {
      return { consumed: url };
    }
    return null;
  };
}