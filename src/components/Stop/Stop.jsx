import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { stopApiService } from "../../api/stop/stopApiService";
import { trouteApiService } from "../../api/troute/trouteApiService";
import { stationApiService } from "../../api/station/stationApiService";

const Stop = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [form] = Form.useForm();

  const fetchStops = async () => {
    setLoading(true);
    try {
      const data = await stopApiService.getAllStops();
      setStops(data);
    } catch (error) {
      message.error("Error al cargar las paradas: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await trouteApiService.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      message.error("Error al cargar las rutas: " + error);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await stationApiService.getAllStations();
      setStations(data);
    } catch (error) {
      message.error("Error al cargar las estaciones: " + error);
    }
  };

  useEffect(() => {
    fetchStops();
    fetchRoutes();
    fetchStations();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_parada",
      key: "id_parada",
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
      title: "Estación",
      dataIndex: "id_estacion",
      key: "id_estacion",
      render: (id_estacion) => {
        const station = stations.find((s) => s.id_estacion === id_estacion);
        return station ? station.nombre : "Desconocida";
      },
    },
    {
      title: "Orden",
      dataIndex: "orden",
      key: "orden",
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
            onClick={() => handleDelete(record.id_parada)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStop(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (stop) => {
    setEditingStop(stop);
    form.setFieldsValue({
      id_ruta: stop.id_ruta,
      id_estacion: stop.id_estacion,
      orden: stop.orden,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (stopId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar esta parada?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await stopApiService.deleteStop(stopId);
          message.success("Parada eliminada exitosamente");
          fetchStops();
        } catch (error) {
          message.error("Error al eliminar la parada: " + error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingStop) {
        await stopApiService.updateStop(editingStop.id_parada, values);
        message.success("Parada actualizada exitosamente");
      } else {
        await stopApiService.createStop(values);
        message.success("Parada creada exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchStops();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar la parada");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Parada
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={stops}
        rowKey="id_parada"
        loading={loading}
      />

      <Modal
        title={editingStop ? "Editar Parada" : "Nueva Parada"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
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
            name="id_estacion"
            label="Estación"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la estación",
              },
            ]}
          >
            <Select placeholder="Selecciona una estación">
              {stations.map((station) => (
                <Select.Option
                  key={station.id_estacion}
                  value={station.id_estacion}
                >
                  {station.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="orden"
            label="Orden"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el orden",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Stop;
