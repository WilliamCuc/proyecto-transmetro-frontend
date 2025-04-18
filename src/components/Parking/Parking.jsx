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
import { parkingApiService } from "../../api/parking/parkingApiService";
import { stationApiService } from "../../api/station/stationApiService";

const Parking = () => {
  const [parkings, setParkings] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [form] = Form.useForm();

  const fetchParkings = async () => {
    setLoading(true);
    try {
      const data = await parkingApiService.getAllParking();
      setParkings(data);
    } catch (error) {
      message.error("Error al cargar los parqueos: " + error.message);
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
    fetchParkings();
    fetchStations();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_parqueo",
      key: "id_parqueo",
    },
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
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
            onClick={() => handleDelete(record.id_parqueo)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingParking(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (parking) => {
    setEditingParking(parking);
    form.setFieldsValue({
      codigo: parking.codigo,
      id_estacion: parking.id_estacion,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (parkingId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este parqueo?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await parkingApiService.deletePARKING(parkingId);
          message.success("Parqueo eliminado exitosamente");
          fetchParkings();
        } catch (error) {
          message.error("Error al eliminar el parqueo: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingParking) {
        const updateData = {
          codigo: values.codigo,
          id_estacion: values.id_estacion,
        };

        await parkingApiService.updateStation(
          editingParking.id_parqueo,
          updateData
        );
        message.success("Parqueo actualizado exitosamente");
      } else {
        const createData = {
          codigo: values.codigo,
          id_estacion: values.id_estacion,
        };

        await parkingApiService.createParking(createData);
        message.success("Parqueo creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchParkings();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el parqueo");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Parqueo
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={parkings}
        rowKey="id_parqueo"
        loading={loading}
      />

      <Modal
        title={editingParking ? "Editar Parqueo" : "Nuevo Parqueo"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="codigo"
            label="Código"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el código del parqueo",
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

export default Parking;
