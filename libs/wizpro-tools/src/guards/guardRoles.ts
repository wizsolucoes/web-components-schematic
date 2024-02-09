import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { getJwtRoles } from "../public-api";



/**
* Rota de guarda de roles Wizco
* @param next 
* @returns boolean
* @description Verifica se o usuário tem permissão para acessar a página
* @example canActivate: [guardWizRoles],
        *  data: {
        *    permission: {
        *      roles: ['administrador'],
        *      prefix: 'wiz.termos.de.uso',
        *      redirectTo: 'terms/error'
        *    }
        *  } 
*/ 
export const guardWizRoles: CanActivateFn = (next: ActivatedRouteSnapshot) => {
      const router = inject(Router);
      const { permission } = next.data;
      
      /// Caso não esteja limpo
      /// Deixa passar
      if(!permission || !permission?.roles || !permission?.prefix || !permission?.redirectTo) {
        return true;
      }  
      

      /// Roles do usuário
      const roles = getJwtRoles();
      const _roles = roles ? roles.map(
        (role: string) => role.toLocaleLowerCase().trim()
      ) : [];
      /// Roles da página
      const _rolesPage = permission.roles ? permission.roles.map(
        (role: string) => `${permission.prefix}.${role}`.toLocaleLowerCase().trim()
      ) : [];


      /// Verifica se o usuário tem permissão
      const hasPermission = _roles.some((role) => _rolesPage.includes(role));
      if(!hasPermission) {
        if(permission.redirectTo) {
          router.navigate([permission.redirectTo]);
          return false;          
        }
        return false;
      }
      return true
  }
