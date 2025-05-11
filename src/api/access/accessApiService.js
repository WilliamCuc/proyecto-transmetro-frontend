import { ACCESS_API_ROUTES } from "./accessApiRoutes";
import axiosService from "../../services/axiosService";

export const accessApiService = {
  getAllAccesses: async () => {
    try {
      const response = await axiosService.get(ACCESS_API_ROUTES.ACCESS_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los accesos"
      );
    }
  },

  getAccessById: async (accessId) => {
    try {
      const params = new URLSearchParams({ access_id: accessId });
      const response = await axiosService.get(
        `${ACCESS_API_ROUTES.ACCESS_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el acceso"
      );
    }
  },

  createAccess: async (accessData) => {
    try {
      const params = new URLSearchParams({
        descripcion: accessData.descripcion,
        id_estacion: accessData.id_estacion.toString(),
      });
      const response = await axiosService.post(
        `${ACCESS_API_ROUTES.ACCESS_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el acceso"
      );
    }
  },

  updateAccess: async (accessId, accessData) => {
    try {
      const params = new URLSearchParams({
        access_id: accessId.toString(),
        descripcion: accessData.descripcion,
        id_estacion: accessData.id_estacion.toString(),
      });
      const response = await axiosService.put(
        `${ACCESS_API_ROUTES.ACCESS_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el acceso"
      );
    }
  },

  deleteAccess: async (accessId) => {
    try {
      const params = new URLSearchParams({ access_id: accessId });
      const response = await axiosService.delete(
        `${ACCESS_API_ROUTES.ACCESS_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el acceso"
      );
    }
  },
};
