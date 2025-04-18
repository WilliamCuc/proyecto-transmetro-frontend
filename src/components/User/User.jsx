// src/components/User/User.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { userApiService } from '../../api/User/userApiService';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Error al cargar los usuarios' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_usuario',
      key: 'id_usuario',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => {
        const roles = {
          1: 'Administrador',
          2: 'Usuario',
        };
        return roles[rol] || 'Desconocido';
      }
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => estado ? 'Activo' : 'Inactivo'
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
            onClick={() => handleDelete(record.id_usuario)}
          >
          </Button>
        </Space>
      ),
    },
  ];

  // Manejadores
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      rol: user.rol.toString(),
      estado: user.estado.toString()
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este usuario?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await userApiService.deleteUser(userId);
          message.success('Usuario eliminado exitosamente');
          fetchUsers();
        } catch (error) {
          message.error('Error al eliminar el usuario' + error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
        const values = await form.validateFields();
        
        if (editingUser) {
            const updateData = {
                nombre: values.nombre,
                apellido: values.apellido,
                correo: values.correo,
                rol: values.rol,
                estado: values.estado
            };
            
            await userApiService.updateUser(editingUser.id_usuario, updateData);
            message.success('Usuario actualizado exitosamente');
        } else {
            const createData = {
                nombre: values.nombre,
                apellido: values.apellido,
                correo: values.correo,
                contrasena: values.contrasena,
                rol: values.rol,
                estado: values.estado
            };
            
            await userApiService.createUser(createData);
            message.success('Usuario creado exitosamente');
        }
        
        setIsModalVisible(false);
        form.resetFields();
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        message.error('Error al guardar el usuario');
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
          Agregar Usuario
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={users}
        rowKey="id_usuario"
        loading={loading}
      />

      <Modal
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
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
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: 'Por favor ingresa el apellido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="correo"
            label="Correo"
            rules={[
              { required: true, message: 'Por favor ingresa el correo' },
              { type: 'email', message: 'Ingresa un correo válido' }
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="contrasena"
              label="Contraseña"
              rules={[{ required: true, message: 'Por favor ingresa la contraseña' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="rol"
            label="Rol"
            rules={[{ required: true, message: 'Por favor selecciona el rol' }]}
          >
            <Select>
              <Select.Option value="1">Administrador</Select.Option>
              <Select.Option value="2">Usuario</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
          >
            <Select>
              <Select.Option value="1">Activo</Select.Option>
              <Select.Option value="0">Inactivo</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;