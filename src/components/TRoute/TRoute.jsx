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
import { trouteApiService } from "../../api/troute/trouteApiService";
import { lineApiService } from "../../api/line/lineApiService";

const TRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form] = Form.useForm();

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await trouteApiService.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      message.error("Error al cargar las rutas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLines = async () => {
    try {
      const data = await lineApiService.getAllLines();
      setLines(data);
    } catch (error) {
      message.error("Error al cargar las líneas: " + error.message);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchLines();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_ruta",
      key: "id_ruta",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Línea",
      dataIndex: "id_linea",
      key: "id_linea",
      render: (id_linea) => {
        const line = lines.find((l) => l.id_linea === id_linea);
        return line ? line.nombre : "Desconocido";
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
            onClick={() => handleDelete(record.id_ruta)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRoute(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    form.setFieldsValue({
      nombre: route.nombre,
      descripcion: route.descripcion,
      id_linea: route.id_linea,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (routeId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar esta ruta?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await trouteApiService.deleteStation(routeId);
          message.success("Ruta eliminada exitosamente");
          fetchRoutes();
        } catch (error) {
          message.error("Error al eliminar la ruta: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRoute) {
        const updateData = {
          nombre: values.nombre,
          descripcion: values.descripcion,
          id_linea: values.id_linea,
        };

        await trouteApiService.updateStation(editingRoute.id_ruta, updateData);
        message.success("Ruta actualizada exitosamente");
      } else {
        const createData = {
          nombre: values.nombre,
          descripcion: values.descripcion,
          id_linea: values.id_linea,
        };

        await trouteApiService.createRoute(createData);
        message.success("Ruta creada exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchRoutes();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar la ruta");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Ruta
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={routes}
        rowKey="id_ruta"
        loading={loading}
      />

      <Modal
        title={editingRoute ? "Editar Ruta" : "Nueva Ruta"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre de la ruta",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la descripción de la ruta",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="id_linea"
            label="Línea"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la línea",
              },
            ]}
          >
            <Select placeholder="Selecciona una línea">
              {lines.map((line) => (
                <Select.Option key={line.id_linea} value={line.id_linea}>
                  {line.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TRoute;
