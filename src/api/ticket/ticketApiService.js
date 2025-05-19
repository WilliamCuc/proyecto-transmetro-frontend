import { TICKET_API_ROUTES } from "./ticketApiRoutes";
import axiosService from "../../services/axiosService";

export const ticketApiService = {
  getAllTickets: async () => {
    try {
      const response = await axiosService.get(TICKET_API_ROUTES.TICKET_GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar los boletos"
      );
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const params = new URLSearchParams({ ticket_id: ticketId });
      const response = await axiosService.get(
        `${TICKET_API_ROUTES.TICKET_GET_BY_ID}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al cargar el boleto"
      );
    }
  },

  createTicket: async (ticketData) => {
    try {
      const params = new URLSearchParams({
        id_usuario: ticketData.id_usuario.toString(),
        id_ruta: ticketData.id_ruta.toString(),
        fecha_compra: ticketData.fecha_compra,
        precio: ticketData.precio.toString(),
      });
      const response = await axiosService.post(
        `${TICKET_API_ROUTES.TICKET_CREATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al crear el boleto"
      );
    }
  },

  updateTicket: async (ticketId, ticketData) => {
    try {
      const params = new URLSearchParams({
        ticket_id: ticketId.toString(),
        id_usuario: ticketData.id_usuario?.toString(),
        id_ruta: ticketData.id_ruta?.toString(),
        fecha_compra: ticketData.fecha_compra,
        precio: ticketData.precio?.toString(),
      });
      const response = await axiosService.put(
        `${TICKET_API_ROUTES.TICKET_UPDATE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar el boleto"
      );
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const params = new URLSearchParams({ ticket_id: ticketId });
      const response = await axiosService.delete(
        `${TICKET_API_ROUTES.TICKET_DELETE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar el boleto"
      );
    }
  },
};
