import { Route } from "@angular/router";

export interface dataRouteModule {
  permission?: {
    roles: string[];
    prefix: string;
    redirectTo: string;
  }
  breadcrumb?: {
    label: string;
    url: string;
  }[]
  [key: string]: any;
}

export interface RouteModule extends Route {
  children?: RouteModule[];
  /**
   * Interface data de rotas para controle de permissões e breadcrumbs
   * @see https://www.npmjs.com/package/@wizco/wizpro-tools
   * @example
   * data: {
    * breadcrumb: [
    *  {
    *     title: 'Home',
    *     url: '/home'
    *   }
    * ],
    * permission: [
    *   {
    *     roles: ['administrador'],
    *     prefix: 'wiz.termos.de.uso',
    *     redirectTo: 'terms/error'
    *   }
    * ]
  */
  data?: dataRouteModule;
}