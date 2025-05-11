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
import { accessApiService } from "../../api/access/accessApiService";
import { stationApiService } from "../../api/station/stationApiService";

const Access = () => {
  const [accesses, setAccesses] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccess, setEditingAccess] = useState(null);
  const [form] = Form.useForm();

  const fetchAccesses = async () => {
    setLoading(true);
    try {
      const data = await accessApiService.getAllAccesses();
      setAccesses(data);
    } catch (error) {
      message.error("Error al cargar los accesos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await stationApiService.getAllStations();
      setStations(data);
    } catch (error) {
      message.error("Error al cargar las estaciones: " + error.message);
    }
  };

  useEffect(() => {
    fetchAccesses();
    fetchStations();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_acceso",
      key: "id_acceso",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Estación",
      dataIndex: "id_estacion",
      key: "id_estacion",
      render: (id_estacion) => {
        const station = stations.find((s) => s.id_estacion === id_estacion);
        return station ? station.nombre : "Desconocido";
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
            onClick={() => handleDelete(record.id_acceso)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingAccess(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (access) => {
    setEditingAccess(access);
    form.setFieldsValue({
      descripcion: access.descripcion,
      id_estacion: access.id_estacion,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (accessId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este acceso?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await accessApiService.deleteAccess(accessId);
          message.success("Acceso eliminado exitosamente");
          fetchAccesses();
        } catch (error) {
          message.error("Error al eliminar el acceso: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingAccess) {
        const updateData = {
          descripcion: values.descripcion,
          id_estacion: values.id_estacion,
        };

        await accessApiService.updateAccess(
          editingAccess.id_acceso,
          updateData
        );
        message.success("Acceso actualizado exitosamente");
      } else {
        const createData = {
          descripcion: values.descripcion,
          id_estacion: values.id_estacion,
        };

        await accessApiService.createAccess(createData);
        message.success("Acceso creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchAccesses();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el acceso");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Acceso
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={accesses}
        rowKey="id_acceso"
        loading={loading}
      />

      <Modal
        title={editingAccess ? "Editar Acceso" : "Nuevo Acceso"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la descripción del acceso",
              },
            ]}
          >
            <Input />
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
        </Form>
      </Modal>
    </div>
  );
};

export default Access;
