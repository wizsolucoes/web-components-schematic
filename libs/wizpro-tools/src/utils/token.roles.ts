
import { jwtDecode } from "jwt-decode";
import { getDataStorage } from '../public-api';

const mapDecodeToken = {
  roles: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
};

/**
 * Retorna o token do usuário
 * @returns any
 */
export function getJwToken(): any {
  const token = getDataStorage('hash', 'w-auth') || getDataStorage('hash', 'x-auth') || null;
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  } 
  return null;
}



/**
 * Retorna os roles do usuário
 * @returns string[] | []
 */
export function getJwtRoles(): string[] | [] {
  const JWT = getJwToken();
  
  if (!!JWT && JWT[mapDecodeToken.roles]) {
    let roles = JWT[mapDecodeToken.roles];
    if(typeof roles === 'string') {
        roles = [roles];
    }
    return roles
  }
  return [];
}

