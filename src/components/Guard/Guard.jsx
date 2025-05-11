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
import { guardApiService } from "../../api/guard/guardApiService";
import { accessApiService } from "../../api/access/accessApiService";

const Guard = () => {
  const [guards, setGuards] = useState([]);
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGuard, setEditingGuard] = useState(null);
  const [form] = Form.useForm();

  const fetchGuards = async () => {
    setLoading(true);
    try {
      const data = await guardApiService.getAllGuards();
      setGuards(data);
    } catch (error) {
      message.error("Error al cargar los guardias: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccesses = async () => {
    try {
      const data = await accessApiService.getAllAccesses();
      setAccesses(data);
    } catch (error) {
      message.error("Error al cargar los accesos: " + error.message);
    }
  };

  useEffect(() => {
    fetchGuards();
    fetchAccesses();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_guardia",
      key: "id_guardia",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Acceso",
      dataIndex: "id_acceso",
      key: "id_acceso",
      render: (id_acceso) => {
        const access = accesses.find((a) => a.id_acceso === id_acceso);
        return access ? access.descripcion : "Desconocido";
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
            onClick={() => handleDelete(record.id_guardia)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingGuard(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (guard) => {
    setEditingGuard(guard);
    form.setFieldsValue({
      nombre: guard.nombre,
      id_acceso: guard.id_acceso,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (guardId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este guardia?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await guardApiService.deleteGuard(guardId);
          message.success("Guardia eliminado exitosamente");
          fetchGuards();
        } catch (error) {
          message.error("Error al eliminar el guardia: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingGuard) {
        const updateData = {
          nombre: values.nombre,
          id_acceso: values.id_acceso,
        };

        await guardApiService.updateGuard(editingGuard.id_guardia, updateData);
        message.success("Guardia actualizado exitosamente");
      } else {
        const createData = {
          nombre: values.nombre,
          id_acceso: values.id_acceso,
        };

        await guardApiService.createGuard(createData);
        message.success("Guardia creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchGuards();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el guardia");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Guardia
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={guards}
        rowKey="id_guardia"
        loading={loading}
      />

      <Modal
        title={editingGuard ? "Editar Guardia" : "Nuevo Guardia"}
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
                message: "Por favor ingresa el nombre del guardia",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="id_acceso"
            label="Acceso"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el acceso",
              },
            ]}
          >
            <Select placeholder="Selecciona un acceso">
              {accesses.map((access) => (
                <Select.Option key={access.id_acceso} value={access.id_acceso}>
                  {access.descripcion}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Guard;
