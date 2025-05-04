import { SCHEDULE_API_ROUTES } from "./scheduleApiRoutes";
import axiosService from "../../services/axiosService";

export const scheduleApiService = {
  getAllSchedules: async () => {
    try {
      const response = await axiosService.get(
        SCHEDULE_API_ROUTES.SCHEDULE_GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los horarios"
      );
    }
  },

  getScheduleById: async (scheduleId) => {
    try {
      const params = new URLSearchParams({ schedule_id: scheduleId });
      const response = await axiosService.get(
        `${SCHEDULE_API_ROUTES.SCHEDULE_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el horario"
      );
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const params = new URLSearchParams({
        id_ruta: scheduleData.id_ruta.toString(),
        hora_salida: scheduleData.hora_salida,
        hora_llegada: scheduleData.hora_llegada,
      });
      const response = await axiosService.post(
        `${SCHEDULE_API_ROUTES.SCHEDULE_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el horario"
      );
    }
  },

  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      const params = new URLSearchParams({
        schedule_id: scheduleId.toString(),
        id_ruta: scheduleData.id_ruta.toString(),
        hora_salida: scheduleData.hora_salida,
        hora_llegada: scheduleData.hora_llegada,
      });
      const response = await axiosService.put(
        `${SCHEDULE_API_ROUTES.SCHEDULE_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el horario"
      );
    }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      const params = new URLSearchParams({ schedule_id: scheduleId });
      const response = await axiosService.delete(
        `${SCHEDULE_API_ROUTES.SCHEDULE_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el horario"
      );
    }
  },
};
