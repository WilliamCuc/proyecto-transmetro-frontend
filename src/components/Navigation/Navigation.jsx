import { Bell, LogOut } from "lucide-react";
import { Tooltip, Dropdown, Menu } from "antd";
import "./Navigation.css";

export default function Navigation() {
  const profileMenu = (
    <Menu
      items={[
        { key: "1", label: "Perfil" },
        { key: "2", label: "Configuración" },
        { key: "3", label: "Cerrar Sesión" },
      ]}
    />
  );

  return (
    <>
      <nav className="navigation-page">
        <div className="navigation-settings">
          <Bell />
          <Dropdown overlay={profileMenu} placement="bottomRight">
            <div className="navigation-user"></div>
          </Dropdown>
        </div>
      </nav>
    </>
  );
}
