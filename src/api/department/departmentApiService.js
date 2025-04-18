import { DEPARTMENT_API_ROUTES } from "./departmentApiRoutes";
import axiosService from "../../services/axiosService";

export const departmentApiService = {
  getAllDepartments: async () => {
    try {
      const response = await axiosService.get(
        DEPARTMENT_API_ROUTES.DEPARTMENT_GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los departamentos"
      );
    }
  },

  getDepartmentById: async (department_id) => {
    try {
      const params = new URLSearchParams({ line_id: department_id });
      const response = await axiosService.get(
        `${DEPARTMENT_API_ROUTES.DEPARTMENT_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el departamento"
      );
    }
  },
};
