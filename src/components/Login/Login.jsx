import React, { useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";
import { userApiService } from "../../api/User/userApiService";
import "./Login.css";
import logo from "../../assets/images/logo-proyecto.png";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const correo = values.username;
    const contrasena = values.password;

    try {
      const userData = await userApiService.login({ correo, contrasena });
      login(userData);
      navigate("/home");
    } catch (error) {
      alert(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <img src={logo} alt="Logo" className="logo" />
        <span className="login-title">MetroTrack</span>
      </div>
      <div className="login-container">
        <h1>Iniciar Sesión</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Por favor ingresa tu usuario" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-button"
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
