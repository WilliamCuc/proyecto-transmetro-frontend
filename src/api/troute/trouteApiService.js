import { TROUTE_API_ROUTES } from "./trouteApiRoutes";
import axiosService from "../../services/axiosService";

export const trouteApiService = {
  getAllRoutes: async () => {
    try {
      const response = await axiosService.get(TROUTE_API_ROUTES.TROUTE_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar las rutas"
      );
    }
  },

  getRouteById: async (routeId) => {
    try {
      const params = new URLSearchParams({ route_id: routeId });
      const response = await axiosService.get(
        `${TROUTE_API_ROUTES.TROUTE_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar la ruta"
      );
    }
  },

  createRoute: async (routeData) => {
    try {
      const params = new URLSearchParams({
        nombre: routeData.nombre,
        descripcion: routeData.descripcion,
        id_linea: routeData.id_linea.toString(),
      });
      const response = await axiosService.post(
        `${TROUTE_API_ROUTES.TROUTE_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al crear la ruta");
    }
  },

  updateStation: async (routeId, routeData) => {
    try {
      const params = new URLSearchParams({
        route_id: routeId.toString(),
        nombre: routeData.nombre,
        descripcion: routeData.ubicacion,
        id_linea: routeData.id_linea.toString(),
      });
      const response = await axiosService.put(
        `${TROUTE_API_ROUTES.TROUTE_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar la ruta"
      );
    }
  },

  deleteStation: async (routeId) => {
    try {
      const params = new URLSearchParams({ route_id: routeId });
      const response = await axiosService.delete(
        `${TROUTE_API_ROUTES.TROUTE_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar la ruta"
      );
    }
  },
};
