import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { scheduleApiService } from "../../api/schedule/scheduleApiService";
import { trouteApiService } from "../../api/troute/trouteApiService";
import moment from "moment";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await scheduleApiService.getAllSchedules();
      setSchedules(data);
    } catch (error) {
      message.error("Error al cargar los horarios: " + error.message);
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

  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_horario",
      key: "id_horario",
    },
    {
      title: "Ruta",
      dataIndex: "id_ruta",
      key: "id_ruta",
      render: (id_ruta) => {
        const route = routes.find((r) => r.id_ruta === id_ruta);
        return route ? route.nombre : "Desconocido";
      },
    },
    {
      title: "Hora de Salida",
      dataIndex: "hora_salida",
      key: "hora_salida",
      render: (hora_salida) => moment.utc(hora_salida * 1000).format("HH:mm"), // Formatear hora
    },
    {
      title: "Hora de Llegada",
      dataIndex: "hora_llegada",
      key: "hora_llegada",
      render: (hora_llegada) => moment.utc(hora_llegada * 1000).format("HH:mm"), // Formatear hora
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
            onClick={() => handleDelete(record.id_horario)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);

    form.setFieldsValue({
      id_ruta: schedule.id_ruta,
      hora_salida: moment.utc(schedule.hora_salida * 1000),
      hora_llegada: moment.utc(schedule.hora_llegada * 1000),
    });

    setIsModalVisible(true);
  };

  const handleDelete = async (scheduleId) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este horario?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await scheduleApiService.deleteSchedule(scheduleId);
          message.success("Horario eliminado exitosamente");
          fetchSchedules();
        } catch (error) {
          message.error("Error al eliminar el horario: " + error.message);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const formattedData = {
        id_ruta: values.id_ruta,
        hora_salida: values.hora_salida.format("HH:mm:ss"),
        hora_llegada: values.hora_llegada.format("HH:mm:ss"),
      };

      if (editingSchedule) {
        await scheduleApiService.updateSchedule(
          editingSchedule.id_horario,
          formattedData
        );
        message.success("Horario actualizado exitosamente");
      } else {
        await scheduleApiService.createSchedule(formattedData);
        message.success("Horario creado exitosamente");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchSchedules();
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al guardar el horario");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Horario
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id_horario"
        loading={loading}
      />

      <Modal
        title={editingSchedule ? "Editar Horario" : "Nuevo Horario"}
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

          {/* Contenedor para los campos de hora */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="hora_salida"
              label="Hora de Salida"
              style={{ flex: 1 }}
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona la hora de salida",
                },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="hora_llegada"
              label="Hora de Llegada"
              style={{ flex: 1 }}
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona la hora de llegada",
                },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedule;
