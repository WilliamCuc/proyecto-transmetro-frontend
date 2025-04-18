import { USER_API_ROUTES } from "./userApiRoutes";
import axiosService from "../../services/axiosService";

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

  // Actualizar un usuario
  updateUser: async (userId, userData) => {
    try {
        const params = new URLSearchParams({
            user_id: userId.toString(),
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            rol: userData.rol.toString(),
            estado: userData.estado.toString()
        });

        const response = await axiosService.put(
            `${USER_API_ROUTES.USER_UPDATE}?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || "Error al actualizar el usuario"
        );
    }
},

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
        const params = new URLSearchParams({
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            contrasena: userData.contrasena,
            rol: userData.rol.toString(),
            estado: userData.estado.toString()
        });
        const response = await axiosService.post(
            `${USER_API_ROUTES.USER_CREATE}?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || "Error al crear el usuario"
        );
    }
},

  // Eliminar un usuario
  deleteUser: async (userId) => {
    try {
      const params = new URLSearchParams({ user_id: userId });
      const response = await axiosService.delete(
        `${USER_API_ROUTES.USER_DELETE}?${params.toString()}`
      );
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
