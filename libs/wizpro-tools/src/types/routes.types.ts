import { Route } from "@angular/router";


/**
 * Interface data de rotas
 * @description Interface de dados de rotas
 * @example
 * {
  * tile: 'Dashboard',
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
export interface dataRouteModule {
  title?: string;
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
  data?: dataRouteModule;
}