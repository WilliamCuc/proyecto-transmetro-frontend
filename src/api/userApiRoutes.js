const BASE_URL = import.meta.env.VITE_API_URL;

export const USER_API_ROUTES = {
  USER_GET_BY_ID: `${BASE_URL}/user/get-by-id`,
  USER_CREATE: `${BASE_URL}/user/create`,
  USER_UPDATE: `${BASE_URL}/user/update`,
  USER_DELETE: `${BASE_URL}/user/delete`,
  USER_GET_ALL: `${BASE_URL}/user/get-all`,
  USER_LOGIN: `${BASE_URL}/user/login`,
};
