import { STATION_API_ROUTES } from "./stationApiRoutes";
import axiosService from "../../services/axiosService";

export const stationApiService = {
  getAllStations: async () => {
    try {
      const response = await axiosService.get(
        STATION_API_ROUTES.STATION_GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar las estaciones"
      );
    }
  },

  getStationById: async (stationId) => {
    try {
      const params = new URLSearchParams({ station_id: stationId });
      const response = await axiosService.get(
        `${STATION_API_ROUTES.STATION_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar la estación"
      );
    }
  },

  createStation: async (stationData) => {
    try {
      const params = new URLSearchParams({
        nombre: stationData.nombre,
        ubicacion: stationData.ubicacion,
        id_municipio: stationData.id_municipio.toString(),
        id_linea: stationData.id_linea.toString(),
      });
      const response = await axiosService.post(
        `${STATION_API_ROUTES.STATION_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear la estación"
      );
    }
  },

  updateStation: async (stationId, stationData) => {
    try {
      const params = new URLSearchParams({
        station_id: stationId.toString(),
        nombre: stationData.nombre,
        ubicacion: stationData.ubicacion,
        id_municipio: stationData.id_municipio.toString(),
        id_linea: stationData.id_linea.toString(),
      });
      const response = await axiosService.put(
        `${STATION_API_ROUTES.STATION_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar la estación"
      );
    }
  },

  deleteStation: async (stationId) => {
    try {
      const params = new URLSearchParams({ station_id: stationId });
      const response = await axiosService.delete(
        `${STATION_API_ROUTES.STATION_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar la estación"
      );
    }
  },
};
