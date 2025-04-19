import { Col, Row } from "antd";
import { BusFront, Users, MapPin } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <Row gutter={16}>
          <Col className="gutter-row" xs={24} sm={12} md={8}>
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <BusFront size={68} />
              </div>
              <div className="dashboard-card-content">
                <div className="dashboard-card-value">10</div>
                <div className="dashboard-card-title">Total Buses</div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={8}>
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <Users size={68} />
              </div>
              <div className="dashboard-card-content">
                <div className="dashboard-card-value">98,129</div>
                <div className="dashboard-card-title">Total Pasajeros</div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={8}>
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <MapPin size={68} />
              </div>
              <div className="dashboard-card-content">
                <div className="dashboard-card-value">127</div>
                <div className="dashboard-card-title">Total Paradas</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="dashboard-map">
        <div className="dashboard-card-map">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1OHKGTQ0nKQ1PNmE30sQIxY_gMR_JTdQ&ehbc=2E312F"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
