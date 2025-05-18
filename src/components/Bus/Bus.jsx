import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { busApiService } from "../../api/bus/busApiService";
import { parkingApiService } from "../../api/parking/parkingApiService";
import { trouteApiService } from "../../api/troute/trouteApiService";

const Bus = () => {
  const [buses, setBuses] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form] = Form.useForm();

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const data = await busApiService.getAllBuses();
      setBuses(data);
    } catch (error) {
      message.error("Error al cargar los buses: " + error.message);
    } finally {
      setLoading(false);
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

  const fetchParkings = async () => {
    try {
      const data = await parkingApiService.getAllParking();
      setParkings(data);
    } catch (error) {
      message.error("Error al cargar los parqueos: " + error.message);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchParkings();
    fetchRoutes();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_bus",
      key: "id_bus",
    },
    {
      title: "Número de Bus",
      dataIndex: "numero_bus",
      key: "numero_bus",
    },
    {
      title: "Capacidad",
      dataIndex: "capacidad",
      key: "capacidad",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
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
      title: "Parqueo",
      dataIndex: "id_parqueo",
      key: "id_parqueo",
      render: (id_parqueo) => {
        const parking = parkings.find((p) => p.id_parqueo === id_parqueo);
        return parking ? parking.codigo : "Desconocido";
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          ></Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id_bus)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingBus(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    form.setFieldsValue({
      numero_bus: bus.numero_bus,
      capacidad: bus.capacidad,
      estado: bus.estado,
      id_parqueo: bus.id_parqueo,
      id_ruta: bus.id_ruta,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (busId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este bus?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await busApiService.deleteBus(busId);
          message.success("Bus eliminado exitosamente");
          fetchBuses();
        } catch (error) {
          message.error("Error al eliminar el bus: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingBus) {
        const updateData = {
          numero_bus: values.numero_bus,
          capacidad: values.capacidad,
          estado: values.estado,
          id_parqueo: values.id_parqueo,
          id_ruta: values.id_ruta,
        };

        await busApiService.updateBus(editingBus.id_bus, updateData);
        message.success("Bus actualizado exitosamente");
      } else {
        const createData = {
          numero_bus: values.numero_bus,
          capacidad: values.capacidad,
          estado: values.estado,
          id_parqueo: values.id_parqueo,
          id_ruta: values.id_ruta,
        };

        await busApiService.createBus(createData);
        message.success("Bus creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchBuses();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el bus");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Bus
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={buses}
        rowKey="id_bus"
        loading={loading}
      />

      <Modal
        title={editingBus ? "Editar Bus" : "Nuevo Bus"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="numero_bus"
            label="Número de Bus"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el número del bus",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacidad"
            label="Capacidad"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la capacidad del bus",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el estado del bus",
              },
            ]}
          >
            <Select placeholder="Selecciona un estado">
              <Select.Option value="activo">Activo</Select.Option>
              <Select.Option value="mantenimiento">Mantenimiento</Select.Option>
              <Select.Option value="fuera de servicio">
                Fuera de Servicio
              </Select.Option>
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
            name="id_parqueo"
            label="Parqueo"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el parqueo",
              },
            ]}
          >
            <Select placeholder="Selecciona un parqueo">
              {parkings.map((parking) => (
                <Select.Option
                  key={parking.id_parqueo}
                  value={parking.id_parqueo}
                >
                  {parking.codigo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bus;
