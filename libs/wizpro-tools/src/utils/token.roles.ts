
import { jwtDecode } from "jwt-decode";
import { getDataStorage } from '../public-api';

const mapDecodeToken = {
  roles: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  features: 'features',
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
    if (typeof roles === 'string') {
      roles = [roles];
    }
    return roles
  }
  return [];
}


/**
 * Retorna as features do usuário
 * @returns string[] | []
 */
export function getJwtFeatures(): string[] | [] {
  const JWT = getJwToken();

  if (!!JWT && JWT[mapDecodeToken.features]) {
    let features = JWT[mapDecodeToken.features];
    if (typeof features === 'string') {
      features = [features];
    }
    return features
  }
  return [];
}

