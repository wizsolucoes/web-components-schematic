
import jwt_decode from 'jwt-decode';
import { getDataStorage } from '../public-api';

export const mapDecodeToken = {
  roles: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
};

export function getJwToken(): any {
  const token = getDataStorage('hash', 'w-auth') || getDataStorage('hash', 'x-auth') || null;
  if (token) {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  } 
  return null;
}

export function getJwtRoles(): string[] | [] {
  const JWT = getJwToken();
  if (!!JWT && JWT[mapDecodeToken.roles]) {
    return JWT[mapDecodeToken.roles];
  }
  return [];
}

