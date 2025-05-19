import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  SwapOutlined,
  FileSearchOutlined,
  BranchesOutlined,
  FullscreenExitOutlined,
  CarOutlined,
  CalendarOutlined,
  BellOutlined,
  LogoutOutlined,
  MailOutlined,
  InsertRowLeftOutlined,
  UserSwitchOutlined,
  EnvironmentOutlined,
  VerticalAlignTopOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Dropdown, Avatar, Badge } from "antd";
import "./Home.css";
import logo from "../../assets/images/logo-proyecto.png";
import { AuthContext } from "../../context/Auth/AuthContext";
import User from "../User/User";
import Dashboard from "../Dashboard/Dashboard";
import TRoute from "../TRoute/TRoute";
import Lines from "../Lines/Lines";
import Station from "../Station/Station";
import Parking from "../Parking/Parking";
import Bus from "../Bus/Bus";
import Pilot from "../Pilot/Pilot";
import Schedule from "../Schedule/Schedule";
import Stop from "../Stop/Stop";
import Guard from "../Guard/Guard";
import Access from "../Access/Access";
import Ticket from "../Ticket/Ticket";
import ReportGuard from "../Report/ReportGuard";
import ReportSoldTicket from "../Report/ReportSoldTicket";

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { logout } = useContext(AuthContext);

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
      case "2-6":
        navigate("/home/bus");
        break;
      case "2-7":
        navigate("/home/pilot");
        break;
      case "2-8":
        navigate("/home/access");
        break;
      case "2-9":
        navigate("/home/guard");
        break;
      case "3-1":
        navigate("/home/report-guard");
        break;
      case "3-2":
        navigate("/home/report-sold-ticket");
        break;
      case "4":
        navigate("/home/schedule");
        break;
      case "5":
        navigate("/home/stops");
        break;
      case "6":
        navigate("/home/ticket");
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
          className="sider-menu"
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
                  icon: <InsertRowLeftOutlined />,
                  label: "Parqueos",
                },
                {
                  key: "2-6",
                  icon: <CarOutlined />,
                  label: "Buses",
                },
                {
                  key: "2-7",
                  icon: <UserSwitchOutlined />,
                  label: "Pilotos",
                },
                {
                  key: "2-8",
                  icon: <VerticalAlignTopOutlined />,
                  label: "Accesos",
                },
                {
                  key: "2-9",
                  icon: <UserSwitchOutlined />,
                  label: "Guardias",
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
                  icon: <FileSearchOutlined />,
                  label: "Guardias",
                },
                {
                  key: "3-2",
                  icon: <FileSearchOutlined />,
                  label: "Ventas",
                },
              ],
            },
            {
              key: "4",
              icon: <CalendarOutlined />,
              label: "Horarios",
            },
            {
              key: "5",
              icon: <EnvironmentOutlined />,
              label: "Paradas",
            },
            {
              key: "6",
              icon: <TagOutlined />,
              label: "Boletos",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
          <div className="header-actions">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    icon: <MailOutlined />,
                    label: "Notificación 1",
                  },
                  { key: "2", icon: <MailOutlined />, label: "Notificación 2" },
                  { key: "3", icon: <MailOutlined />, label: "Notificación 3" },
                  { key: "4", icon: <MailOutlined />, label: "Notificación 4" },
                  { key: "5", icon: <MailOutlined />, label: "Notificación 5" },
                ],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Badge count={5}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: "20px" }} />}
                />
              </Badge>
            </Dropdown>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    icon: <SettingOutlined />,
                    label: "Configurar Perfil",
                  },
                  {
                    key: "2",
                    icon: <LogoutOutlined />,
                    label: "Cerrar Sesión",
                    onClick: logout,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Avatar
                style={{ backgroundColor: "#001529", cursor: "pointer" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
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
            <Route path="bus" element={<Bus />} />
            <Route path="pilot" element={<Pilot />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="stops" element={<Stop />} />
            <Route path="guard" element={<Guard />} />
            <Route path="access" element={<Access />} />
            <Route path="ticket" element={<Ticket />} />
            <Route path="report-guard" element={<ReportGuard />} />
            <Route path="report-sold-ticket" element={<ReportSoldTicket />} />
            <Route index element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
