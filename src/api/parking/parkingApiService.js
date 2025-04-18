import { PARKING_API_ROUTES } from "./parkingApiRoutes";
import axiosService from "../../services/axiosService";

export const parkingApiService = {
  getAllParking: async () => {
    try {
      const response = await axiosService.get(
        PARKING_API_ROUTES.PARKING_GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los parqueos"
      );
    }
  },

  getParkingById: async (parkingId) => {
    try {
      const params = new URLSearchParams({ parking_id: parkingId });
      const response = await axiosService.get(
        `${PARKING_API_ROUTES.PARKING_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el parqueo"
      );
    }
  },

  createParking: async (parkingData) => {
    try {
      const params = new URLSearchParams({
        codigo: parkingData.codigo,
        id_estacion: parkingData.id_estacion.toString(),
      });
      const response = await axiosService.post(
        `${PARKING_API_ROUTES.PARKING_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el parqueo"
      );
    }
  },

  updateStation: async (parkingId, parkingData) => {
    try {
      const params = new URLSearchParams({
        parking_id: parkingId.toString(),
        codigo: parkingData.codigo,
        id_estacion: parkingData.id_estacion.toString(),
      });
      const response = await axiosService.put(
        `${PARKING_API_ROUTES.PARKING_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el parqueo"
      );
    }
  },

  deletePARKING: async (parkingId) => {
    try {
      const params = new URLSearchParams({ parking_id: parkingId });
      const response = await axiosService.delete(
        `${PARKING_API_ROUTES.PARKING_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el parqueo"
      );
    }
  },
};
