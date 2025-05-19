import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ticketApiService } from "../../api/ticket/ticketApiService";
import { userApiService } from "../../api/User/userApiService";
import { trouteApiService } from "../../api/troute/trouteApiService";
import dayjs from "dayjs";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [form] = Form.useForm();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketApiService.getAllTickets();
      setTickets(data);
    } catch (error) {
      message.error("Error al cargar los boletos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userApiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("Error al cargar los usuarios: " + error.message);
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await trouteApiService.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      message.error("Error al cargar las rutas: " + error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchRoutes();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_boleto",
      key: "id_boleto",
    },
    {
      title: "Usuario",
      dataIndex: "id_usuario",
      key: "id_usuario",
      render: (id_usuario) => {
        const user = users.find((u) => u.id_usuario === id_usuario);
        return user ? user.nombre : "Desconocido";
      },
    },
    {
      title: "Ruta",
      dataIndex: "id_ruta",
      key: "id_ruta",
      render: (id_ruta) => {
        const route = routes.find((r) => r.id_ruta === id_ruta);
        return route ? route.nombre : "Desconocida";
      },
    },
    {
      title: "Fecha de compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      render: (fecha) => (fecha ? dayjs(fecha).format("YYYY-MM-DD HH:mm") : ""),
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (precio) => `Q${precio}`,
    },
  ];

  const handleAdd = () => {
    setEditingTicket(null);
    form.resetFields();
    form.setFieldsValue({
      fecha_compra: dayjs(),
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        id_usuario: values.id_usuario,
        id_ruta: values.id_ruta,
        fecha_compra: values.fecha_compra
          ? values.fecha_compra.format("YYYY-MM-DD HH:mm:ss")
          : null,
        precio: values.precio,
      };

      if (editingTicket) {
        await ticketApiService.updateTicket(editingTicket.id_boleto, payload);
        message.success("Boleto actualizado exitosamente");
      } else {
        await ticketApiService.createTicket(payload);
        message.success("Boleto creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchTickets();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el boleto");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<DollarOutlined />} onClick={handleAdd}>
          Comprar Boleto
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tickets}
        rowKey="id_boleto"
        loading={loading}
      />

      <Modal
        title={editingTicket ? "Editar Boleto" : "Nuevo Boleto"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id_usuario"
            label="Usuario"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el usuario",
              },
            ]}
          >
            <Select placeholder="Selecciona un usuario">
              {users.map((user) => (
                <Select.Option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="id_ruta"
            label="Ruta"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la ruta",
              },
            ]}
          >
            <Select placeholder="Selecciona una ruta">
              {routes.map((route) => (
                <Select.Option key={route.id_ruta} value={route.id_ruta}>
                  {route.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="fecha_compra"
            label="Fecha de compra"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la fecha y hora de compra",
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="precio"
            label="Precio"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el precio",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              prefix="Q"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Ticket;
