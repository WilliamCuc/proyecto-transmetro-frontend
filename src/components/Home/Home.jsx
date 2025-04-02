import React, { useState } from "react";
import {
  Menu as MenuButton,
  Gauge,
  Cog,
  Compass,
  BarChart,
} from "lucide-react";
import { Layout, Menu } from "antd";
import Navigation from "../Navigation/Navigation";
import "./Home.css";
import logo from "../../assets/images/logo-proyecto.png";

const { Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth="80"
        className="layout-sider"
      >
        <div className={`logo ${collapsed ? "collapsed" : ""}`}>
          {!collapsed && (
            <div className="logo-info">
              <img src={logo} alt="Logo" />
              <span className="logo-text">MetroTrack</span>
            </div>
          )}
          <MenuButton onClick={toggleMenu} className="menu-button" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <Gauge />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <Cog />,
              label: "Catálogos",
            },
            {
              key: "3",
              icon: <Compass />,
              label: "Explorar",
            },
            {
              key: "4",
              icon: <BarChart />,
              label: "Reportes",
            },
          ]}
          className="layout-menu"
        />
      </Sider>

      <Layout>
        <div className="layout-navigation">
          <Navigation />
        </div>

        <Content className="layout-content">
          <h1>Bienvenido al sistema MetroTrack</h1>
        </Content>
      </Layout>
    </Layout>
  );
}
