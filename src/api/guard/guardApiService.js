import { GUARD_API_ROUTES } from "./guardApiRoutes";
import axiosService from "../../services/axiosService";

export const guardApiService = {
  getAllGuards: async () => {
    try {
      const response = await axiosService.get(GUARD_API_ROUTES.GUARD_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los guardias"
      );
    }
  },

  getGuardById: async (guardId) => {
    try {
      const params = new URLSearchParams({ guard_id: guardId });
      const response = await axiosService.get(
        `${GUARD_API_ROUTES.GUARD_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el guardia"
      );
    }
  },

  createGuard: async (guardData) => {
    try {
      const params = new URLSearchParams({
        nombre: guardData.nombre,
        id_acceso: guardData.id_acceso.toString(),
      });
      const response = await axiosService.post(
        `${GUARD_API_ROUTES.GUARD_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el guardia"
      );
    }
  },

  updateGuard: async (guardId, guardData) => {
    try {
      const params = new URLSearchParams({
        guard_id: guardId.toString(),
        nombre: guardData.nombre,
        id_acceso: guardData.id_acceso.toString(),
      });
      const response = await axiosService.put(
        `${GUARD_API_ROUTES.GUARD_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el guardia"
      );
    }
  },

  deleteGuard: async (guardId) => {
    try {
      const params = new URLSearchParams({ guard_id: guardId });
      const response = await axiosService.delete(
        `${GUARD_API_ROUTES.GUARD_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el guardia"
      );
    }
  },
};
