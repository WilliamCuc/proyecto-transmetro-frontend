import { STOP_API_ROUTES } from "./stopApiRoutes";
import axiosService from "../../services/axiosService";

export const stopApiService = {
  getAllStops: async () => {
    try {
      const response = await axiosService.get(STOP_API_ROUTES.STOP_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar las paradas"
      );
    }
  },

  getStopById: async (stopId) => {
    try {
      const params = new URLSearchParams({ stop_id: stopId });
      const response = await axiosService.get(
        `${STOP_API_ROUTES.STOP_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar la parada"
      );
    }
  },

  createStop: async (stopData) => {
    try {
      const params = new URLSearchParams({
        id_ruta: stopData.id_ruta.toString(),
        id_estacion: stopData.id_estacion.toString(),
        orden: stopData.orden.toString(),
      });
      const response = await axiosService.post(
        `${STOP_API_ROUTES.STOP_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear la parada"
      );
    }
  },

  updateStop: async (stopId, stopData) => {
    try {
      const params = new URLSearchParams({
        stop_id: stopId.toString(),
        id_ruta: stopData.id_ruta?.toString(),
        id_estacion: stopData.id_estacion?.toString(),
        orden: stopData.orden?.toString(),
      });
      const response = await axiosService.put(
        `${STOP_API_ROUTES.STOP_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar la parada"
      );
    }
  },

  deleteStop: async (stopId) => {
    try {
      const params = new URLSearchParams({ stop_id: stopId });
      const response = await axiosService.delete(
        `${STOP_API_ROUTES.STOP_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar la parada"
      );
    }
  },
};
