import { USER_API_ROUTES } from "./userApiRoutes";
import axiosService from "../services/axiosService";

export const userApiService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await axiosService.post(
        USER_API_ROUTES.USER_LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
    }
  },

  // Obtener un usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await axiosService.get(USER_API_ROUTES.USER_GET_BY_ID, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener el usuario"
      );
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await axiosService.post(
        USER_API_ROUTES.USER_CREATE,
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el usuario"
      );
    }
  },

  // Actualizar un usuario
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosService.put(USER_API_ROUTES.USER_UPDATE, {
        user_id: userId,
        ...userData,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el usuario"
      );
    }
  },

  // Eliminar un usuario
  deleteUser: async (userId) => {
    try {
      const response = await axiosService.delete(USER_API_ROUTES.USER_DELETE, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el usuario"
      );
    }
  },

  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const response = await axiosService.get(USER_API_ROUTES.USER_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los usuarios"
      );
    }
  },
};
