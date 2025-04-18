// src/components/Lines/Lines.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { lineApiService } from '../../api/line/lineApiService';

const Lines = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [form] = Form.useForm();

  const fetchLines = async () => {
    setLoading(true);
    try {
        const data = await lineApiService.getAllLines();
        setLines(data);
    } catch (error) {
        message.error('Error al cargar las líneas' + error);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchLines();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_linea',
      key: 'id_linea',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Distancia Total',
      dataIndex: 'distancia_total',
      key: 'distancia_total',
      render: (distancia) => `${distancia} km`
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        const estados = {
          1: 'Activo',
          0: 'Inactivo',
          2: 'En Mantenimiento'
        };
        return estados[estado] || 'Desconocido';
      }
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id_linea)}
          >
            
          </Button>
        </Space>
      ),
    },
  ];

  // Manejadores
  const handleAdd = () => {
    setEditingLine(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (line) => {
    setEditingLine(line);
    form.setFieldsValue({
        nombre: line.nombre,
        distancia_total: parseFloat(line.distancia_total),
        estado: line.estado.toString()
    });
    setIsModalVisible(true);
};

  const handleDelete = async (lineId) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar esta línea?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await lineApiService.deleteLine(lineId);
          message.success('Línea eliminada exitosamente');
          fetchLines();
        } catch (error) {
          message.error('Error al eliminar la línea ' + error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
        const values = await form.validateFields();
        
        if (editingLine) {
            const updateData = {
                nombre: values.nombre,
                distancia_total: parseFloat(values.distancia_total),
                estado: parseInt(values.estado)
            };
            
            await lineApiService.updateLine(editingLine.id_linea, updateData);
            message.success('Línea actualizada exitosamente');
        } else {
            // Para crear
            const createData = {
                nombre: values.nombre,
                distancia_total: parseFloat(values.distancia_total),
                estado: parseInt(values.estado)
            };
            
            await lineApiService.createLine(createData);
            message.success('Línea creada exitosamente');
        }
        
        setIsModalVisible(false);
        form.resetFields();
        fetchLines();
    } catch (error) {
        console.error('Error:', error);
        message.error('Error al guardar la línea');
    }
};

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Agregar Línea
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={lines}
        rowKey="id_linea"
        loading={loading}
      />

      <Modal
        title={editingLine ? "Editar Línea" : "Nueva Línea"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la línea' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="distancia_total"
            label="Distancia Total (km)"
            rules={[{ required: true, message: 'Por favor ingresa la distancia total' }]}
          >
            <InputNumber 
              min={0} 
              step={0.1} 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
          >
            <Select>
              <Select.Option value="1">Activo</Select.Option>
              <Select.Option value="0">Inactivo</Select.Option>
              <Select.Option value="2">En Mantenimiento</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Lines;