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

export const setDataStorage = (data: any, storage = 'w-auth') => {
  localStorage.setItem(storage, JSON.stringify(data));
};


export const getWizcoToken = () => {
  return getDataStorage('token', 'w-auth');
};

export const getWizcoUser = () => {
  return getDataStorage('', 'w-user');
};

export const getWizcoTenant = () => {
  return getDataStorage('tenant', 'w-theme');
};

export const getWizcoTheme = () => {
  return getDataStorage('', 'w-theme');
};



