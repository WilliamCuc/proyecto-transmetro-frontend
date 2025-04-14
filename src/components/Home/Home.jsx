import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  SwapOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "./Home.css";
import logo from "../../assets/images/logo-proyecto.png";

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <SettingOutlined />,
              label: "Catálogos",
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
          <h1>Bienvenido al sistema MetroTrack</h1>
          <p>Contenido</p>
        </Content>
      </Layout>
    </Layout>
  );
}
