import { REPORT_API_ROUTES } from "./reportApiRoutes";
import axiosService from "../../services/axiosService";

export const reportApiService = {
  getGuardByStation: async (id_estacion) => {
    try {
      let url = REPORT_API_ROUTES.REPORT_GET_GUARD_BY_STATION;
      if (id_estacion !== undefined && id_estacion !== null) {
        url += `?id_estacion=${id_estacion}`;
      }
      const response = await axiosService.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los boletos"
      );
    }
  },

  getSoldTicket: async (fecha_inicio, fecha_fin) => {
    try {
      let url = REPORT_API_ROUTES.REPORT_GET_SOLD_TICKET;
      const params = [];
      if (fecha_inicio)
        params.push(`fecha_inicio=${encodeURIComponent(fecha_inicio)}`);
      if (fecha_fin) params.push(`fecha_fin=${encodeURIComponent(fecha_fin)}`);
      if (params.length > 0) {
        url += "?" + params.join("&");
      }
      const response = await axiosService.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los boletos vendidos"
      );
    }
  },
};
