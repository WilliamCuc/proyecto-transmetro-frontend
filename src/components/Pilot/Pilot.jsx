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
import { pilotApiService } from "../../api/pilot/pilotApiService";
import { busApiService } from "../../api/bus/busApiService";

const Pilot = () => {
  const [pilots, setPilots] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPilot, setEditingPilot] = useState(null);
  const [form] = Form.useForm();

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const data = await pilotApiService.getAllPilots();
      setPilots(data);
    } catch (error) {
      message.error("Error al cargar los pilotos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await busApiService.getAllBuses();
      setBuses(data);
    } catch (error) {
      message.error("Error al cargar los buses: " + error.message);
    }
  };

  useEffect(() => {
    fetchPilots();
    fetchBuses();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_piloto",
      key: "id_piloto",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Historial Educativo",
      dataIndex: "historial_educativo",
      key: "historial_educativo",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Bus Asignado",
      dataIndex: "id_bus",
      key: "id_bus",
      render: (id_bus) => {
        const bus = buses.find((b) => b.id_bus === id_bus);
        return bus ? bus.numero_bus : "No asignado";
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
            onClick={() => handleDelete(record.id_piloto)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPilot(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (pilot) => {
    setEditingPilot(pilot);
    form.setFieldsValue({
      nombre: pilot.nombre,
      historial_educativo: pilot.historial_educativo,
      direccion: pilot.direccion,
      telefono: pilot.telefono,
      id_bus: pilot.id_bus,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (pilotId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este piloto?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await pilotApiService.deletePilot(pilotId);
          message.success("Piloto eliminado exitosamente");
          fetchPilots();
        } catch (error) {
          message.error("Error al eliminar el piloto: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingPilot) {
        const updateData = {
          nombre: values.nombre,
          historial_educativo: values.historial_educativo,
          direccion: values.direccion,
          telefono: values.telefono,
          id_bus: values.id_bus,
        };

        await pilotApiService.updatePilot(editingPilot.id_piloto, updateData);
        message.success("Piloto actualizado exitosamente");
      } else {
        const createData = {
          nombre: values.nombre,
          historial_educativo: values.historial_educativo,
          direccion: values.direccion,
          telefono: values.telefono,
          id_bus: values.id_bus,
        };

        await pilotApiService.createPilot(createData);
        message.success("Piloto creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchPilots();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el piloto");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Piloto
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pilots}
        rowKey="id_piloto"
        loading={loading}
      />

      <Modal
        title={editingPilot ? "Editar Piloto" : "Nuevo Piloto"}
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
                message: "Por favor ingresa el nombre del piloto",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="historial_educativo"
            label="Historial Educativo"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el historial educativo",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la dirección",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el teléfono",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="id_bus"
            label="Bus Asignado"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el bus asignado",
              },
            ]}
          >
            <Select placeholder="Selecciona un bus">
              {buses.map((bus) => (
                <Select.Option key={bus.id_bus} value={bus.id_bus}>
                  {bus.numero_bus}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pilot;
