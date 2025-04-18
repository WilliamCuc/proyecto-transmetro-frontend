import { LINE_API_ROUTES } from "./lineApiRoutes";
import axiosService from "../../services/axiosService";

export const lineApiService = {
  getAllLines: async () => {
    try {
      const response = await axiosService.get(LINE_API_ROUTES.LINE_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar las líneas"
      );
    }
  },

  getLineById: async (lineId) => {
    try {
      const params = new URLSearchParams({ line_id: lineId });
      const response = await axiosService.get(
        `${LINE_API_ROUTES.LINE_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar la línea"
      );
    }
  },

  createLine: async (lineData) => {
    try {
      const params = new URLSearchParams({
        nombre: lineData.nombre,
        distancia_total: lineData.distancia_total.toString(),
        estado: lineData.estado.toString(),
      });
      const response = await axiosService.post(
        `${LINE_API_ROUTES.LINE_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear la línea"
      );
    }
  },

  updateLine: async (lineId, lineData) => {
    try {
      const params = new URLSearchParams({
        line_id: lineId.toString(),
        nombre: lineData.nombre,
        distancia_total: lineData.distancia_total.toString(),
        estado: lineData.estado.toString(),
      });
      const response = await axiosService.put(
        `${LINE_API_ROUTES.LINE_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar la línea"
      );
    }
  },

  deleteLine: async (lineId) => {
    try {
      const params = new URLSearchParams({ line_id: lineId });
      const response = await axiosService.delete(
        `${LINE_API_ROUTES.LINE_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar la línea"
      );
    }
  },
};
