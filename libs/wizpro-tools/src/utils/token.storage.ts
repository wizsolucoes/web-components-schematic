export const getDataStorage = (param: string | '', storage = 'x-auth') => {
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

export const setDataStorage = (data: any, storage = 'x-auth') => {
  localStorage.setItem(storage, JSON.stringify(data));
};
