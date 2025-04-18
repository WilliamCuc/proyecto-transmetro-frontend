import { MUNICIPALITY_API_ROUTES } from "./municipalityApiRoutes";
import axiosService from "../../services/axiosService";

export const municipalityApiService = {
  getAllLines: async () => {
    try {
      const response = await axiosService.get(
        MUNICIPALITY_API_ROUTES.MUNICIPALITY_GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los municipios"
      );
    }
  },

  getLineById: async (lineId) => {
    try {
      const params = new URLSearchParams({ line_id: lineId });
      const response = await axiosService.get(
        `${MUNICIPALITY_API_ROUTES.MUNICIPALITY_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el municipio"
      );
    }
  },

  getMunicipalityByDepartmentId: async (department_id) => {
    try {
      const response = await axiosService.get(
        `${MUNICIPALITY_API_ROUTES.MUNICIPALITY_GET_BY_DEPARTMENT_ID}/${department_id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los municipios"
      );
    }
  },
};
