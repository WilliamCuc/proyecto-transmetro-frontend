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
import { stationApiService } from "../../api/station/stationApiService";
import { departmentApiService } from "../../api/department/departmentApiService";
import { municipalityApiService } from "../../api/municipality/municipalityApiService";
import { lineApiService } from "../../api/line/lineApiService";

const Station = () => {
  const [stations, setStations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [lines, setLines] = useState([]);

  const [form] = Form.useForm();

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await stationApiService.getAllStations();
      setStations(data);
    } catch (error) {
      message.error("Error al cargar las estaciones: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLines = async () => {
    try {
      const data = await lineApiService.getAllLines();
      setLines(data);
    } catch (error) {
      message.error("Error al cargar las líneas: " + error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await departmentApiService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      message.error("Error al cargar los departamentos: " + error);
    }
  };

  const fetchMunicipalitiesByDepartment = async (departmentId) => {
    try {
      const data = await municipalityApiService.getMunicipalityByDepartmentId(
        departmentId
      );
      setMunicipalities(data);
    } catch (error) {
      message.error("Error al cargar los municipios: " + error);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchDepartments();
    fetchLines();
  }, []);

  const handleDepartmentChange = (departmentId) => {
    form.setFieldsValue({ id_municipio: null });
    fetchMunicipalitiesByDepartment(departmentId);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_estacion",
      key: "id_estacion",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Ubicación",
      dataIndex: "ubicacion",
      key: "ubicacion",
    },
    {
      title: "Línea",
      dataIndex: "id_linea",
      key: "id_linea",
      render: (id_linea) => {
        const line = lines.find((l) => l.id_linea === id_linea);
        return line ? line.nombre : "Desconocida";
      },
    },
    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
    },
    {
      title: "Municipio",
      dataIndex: "municipio",
      key: "municipio",
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
            onClick={() => handleDelete(record.id_estacion)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    form.setFieldsValue({
      nombre: station.nombre,
      ubicacion: station.ubicacion,
      id_municipio: station.id_municipio,
      id_departamento: station.id_departamento,
      id_linea: station.id_linea,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (stationId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar esta estación?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await stationApiService.deleteStation(stationId);
          message.success("Estación eliminada exitosamente");
          fetchStations();
        } catch (error) {
          message.error("Error al eliminar la estación: " + error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingStation) {
        const updateData = {
          nombre: values.nombre,
          ubicacion: values.ubicacion,
          id_municipio: values.id_municipio,
          id_linea: values.id_linea,
        };

        await stationApiService.updateStation(
          editingStation.id_estacion,
          updateData
        );
        message.success("Estación actualizada exitosamente");
      } else {
        const createData = {
          nombre: values.nombre,
          ubicacion: values.ubicacion,
          id_municipio: values.id_municipio,
          id_linea: values.id_linea,
        };

        await stationApiService.createStation(createData);
        message.success("Estación creada exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchStations();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar la estación");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Estación
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={stations}
        rowKey="id_estacion"
        loading={loading}
      />

      <Modal
        title={editingStation ? "Editar Estación" : "Nueva Estación"}
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
                message: "Por favor ingresa el nombre de la estación",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ubicacion"
            label="Ubicación"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la ubicación",
              },
            ]}
          >
            <Input />
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
          <Form.Item
            name="id_departamento"
            label="Departamento"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el departamento",
              },
            ]}
          >
            <Select
              onChange={handleDepartmentChange}
              placeholder="Selecciona un departamento"
            >
              {departments.map((department) => (
                <Select.Option
                  key={department.id_departamento}
                  value={department.id_departamento}
                >
                  {department.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="id_municipio"
            label="Municipio"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el municipio",
              },
            ]}
          >
            <Select placeholder="Selecciona un municipio">
              {municipalities.map((municipality) => (
                <Select.Option
                  key={municipality.id_municipio}
                  value={municipality.id_municipio}
                >
                  {municipality.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Station;
