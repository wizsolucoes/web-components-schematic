/**
 * @description Função para pegar dados do localstorage
 * @param (param: string | '', storage: string)
 * @returns any
 * @example getDataStorage('token', 'w-auth')
*/
export const getDataStorage = (param: string | '', storage = 'w-auth') => {
  const data = localStorage.getItem(storage);
  if (data) {
    const verifyObject = data.startsWith('{') && data.endsWith('}');
    const verifyArray = data.startsWith('[') && data.endsWith(']');
    if (!verifyObject && !verifyArray) {
      return data;
    }
    return param ? JSON.parse(data)[param] : JSON.parse(data);
  }
  return null;
};

/**
 * @description Função para setar dados no localstorage
 * @param (data: any, storage: string)
 * @returns void
 * @example setDataStorage('token', 'w-auth')
*/
export const setDataStorage = (data: any, storage = 'w-auth') => {
  localStorage.setItem(storage, JSON.stringify(data));
};


/**
 * @description Retorna o token do usuário
 * @example getWizcoToken()
 * @returns any
*/
export const getWizcoToken = () => {
  return getDataStorage('token', 'w-auth');
};

/**
 * @description Retorna os dados do usuário
 * @example getWizcoUser()
 * @returns any
*/
export const getWizcoUser = () => {
  return getDataStorage('', 'w-user');
};

/**
 * @description Retorna o tenant 
 * @example getWizcoTenant()
 * @returns any
*/
export const getWizcoTenant = () => {
  return getDataStorage('tenant', 'w-theme');
};

/**
 * @description Retorna o tema do tenant
 * @example getWizcoTheme()
 * @returns any
*/
export const getWizcoTheme = () => {
  return getDataStorage('', 'w-theme');
};



