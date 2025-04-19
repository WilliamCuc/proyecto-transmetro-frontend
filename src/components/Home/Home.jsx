import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  SwapOutlined,
  FilePdfOutlined,
  BranchesOutlined,
  FullscreenExitOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "./Home.css";
import logo from "../../assets/images/logo-proyecto.png";
import User from "../User/User";
import Dashboard from "../Dashboard/Dashboard";
import TRoute from "../TRoute/TRoute";
import Lines from "../Lines/Lines";
import Station from "../Station/Station";
import Parking from "../Parking/Parking";

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "1":
        navigate("/home/dashboard");
        break;
      case "2-1":
        navigate("/home/users");
        break;
      case "2-2":
        navigate("/home/routes");
        break;
      case "2-3":
        navigate("/home/lines");
        break;
      case "2-4":
        navigate("/home/stations");
        break;
      case "2-5":
        navigate("/home/parking");
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="sider-logo">
          <img src={logo} alt="Logo" />
          {!collapsed && <span className="sider-title">MetroTrack</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={handleMenuClick}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <SettingOutlined />,
              label: "Configuración",
              children: [
                {
                  key: "2-1",
                  icon: <UserOutlined />,
                  label: "Usuarios",
                },
                {
                  key: "2-2",
                  icon: <SwapOutlined />,
                  label: "Rutas",
                },
                {
                  key: "2-3",
                  icon: <BranchesOutlined />,
                  label: "Lineas",
                },
                {
                  key: "2-4",
                  icon: <FullscreenExitOutlined />,
                  label: "Estaciones",
                },
                {
                  key: "2-5",
                  icon: <CarOutlined />,
                  label: "Parqueo",
                },
              ],
            },
            {
              key: "3",
              icon: <FileOutlined />,
              label: "Reportes",
              children: [
                {
                  key: "3-1",
                  icon: <FilePdfOutlined />,
                  label: "Ventas",
                },
                {
                  key: "3-2",
                  icon: <FilePdfOutlined />,
                  label: "Inventario",
                },
              ],
            },
            {
              key: "4",
              icon: <CalendarOutlined />,
              label: "Horarios",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users/*" element={<User />} />
            <Route path="routes" element={<TRoute />} />
            <Route path="lines" element={<Lines />} />
            <Route path="stations" element={<Station />} />
            <Route path="parking" element={<Parking />} />
            <Route index element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
