import { BUS_API_ROUTES } from "./busApiRoutes";
import axiosService from "../../services/axiosService";

export const busApiService = {
  getAllBuses: async () => {
    try {
      const response = await axiosService.get(BUS_API_ROUTES.BUS_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los buses"
      );
    }
  },

  getBusById: async (busId) => {
    try {
      const params = new URLSearchParams({ bus_id: busId });
      const response = await axiosService.get(
        `${BUS_API_ROUTES.BUS_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al cargar el bus");
    }
  },

  createBus: async (busData) => {
    try {
      const params = new URLSearchParams({
        numero_bus: busData.numero_bus,
        capacidad: busData.capacidad.toString(),
        estado: busData.estado,
        id_parqueo: busData.id_parqueo.toString(),
      });
      const response = await axiosService.post(
        `${BUS_API_ROUTES.BUS_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al crear el bus");
    }
  },

  updateBus: async (busId, busData) => {
    try {
      const params = new URLSearchParams({
        bus_id: busId.toString(),
        numero_bus: busData.numero_bus,
        capacidad: busData.capacidad.toString(),
        estado: busData.estado,
        id_parqueo: busData.id_parqueo.toString(),
      });
      const response = await axiosService.put(
        `${BUS_API_ROUTES.BUS_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el bus"
      );
    }
  },

  deleteBus: async (busId) => {
    try {
      const params = new URLSearchParams({ bus_id: busId });
      const response = await axiosService.delete(
        `${BUS_API_ROUTES.BUS_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el bus"
      );
    }
  },
};
