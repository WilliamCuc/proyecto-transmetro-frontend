import { PILOT_API_ROUTES } from "./pilotApiRoutes";
import axiosService from "../../services/axiosService";

export const pilotApiService = {
  getAllPilots: async () => {
    try {
      const response = await axiosService.get(PILOT_API_ROUTES.PILOT_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los pilotos"
      );
    }
  },

  getPilotById: async (pilotId) => {
    try {
      const params = new URLSearchParams({ pilot_id: pilotId });
      const response = await axiosService.get(
        `${PILOT_API_ROUTES.PILOT_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el piloto"
      );
    }
  },

  createPilot: async (pilotData) => {
    try {
      const params = new URLSearchParams({
        nombre: pilotData.nombre,
        historial_educativo: pilotData.historial_educativo,
        direccion: pilotData.direccion,
        telefono: pilotData.telefono,
        id_bus: pilotData.id_bus.toString(),
      });
      const response = await axiosService.post(
        `${PILOT_API_ROUTES.PILOT_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el piloto"
      );
    }
  },

  updatePilot: async (pilotId, pilotData) => {
    try {
      const params = new URLSearchParams({
        pilot_id: pilotId.toString(),
        nombre: pilotData.nombre,
        historial_educativo: pilotData.historial_educativo,
        direccion: pilotData.direccion,
        telefono: pilotData.telefono,
        id_bus: pilotData.id_bus.toString(),
      });
      const response = await axiosService.put(
        `${PILOT_API_ROUTES.PILOT_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el piloto"
      );
    }
  },

  deletePilot: async (pilotId) => {
    try {
      const params = new URLSearchParams({ pilot_id: pilotId });
      const response = await axiosService.delete(
        `${PILOT_API_ROUTES.PILOT_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el piloto"
      );
    }
  },
};
