import React, { useEffect, useState } from "react";
import { Table, Card, message, Button, Space, Select } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { reportApiService } from "../../api/report/reportApiService";
import { stationApiService } from "../../api/station/stationApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Report.css";

const ReportGuard = () => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  let randomCode = Math.floor(Math.random() * 1000000);

  const fetchStations = async () => {
    try {
      const result = await stationApiService.getAllStations();
      setStations(result);
    } catch (error) {
      message.error("Error al cargar las estaciones: " + error.message);
    }
  };

  const fetchReport = async (id_estacion = null) => {
    setLoading(true);
    try {
      const result = await reportApiService.getGuardByStation(id_estacion);
      setData(result);
    } catch (error) {
      message.error("Error al cargar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchReport();
  }, []);

  const handleSearch = () => {
    fetchReport(selectedStation);
  };

  const columns = [
    { title: "ID", dataIndex: "id_registro", key: "id_registro" },
    { title: "Nombre Guardia", dataIndex: "guardia", key: "guardia" },
    { title: "Acceso", dataIndex: "acceso", key: "acceso" },
    { title: "Estación", dataIndex: "estacion", key: "estacion" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReporteGuardias");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ReporteGuardias_" + randomCode + ".xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Guardias", 14, 10);
    autoTable(doc, {
      head: [columns.map((col) => col.title)],
      body: data.map((row) => columns.map((col) => row[col.dataIndex])),
      startY: 20,
    });
    doc.save("ReporteGuardias_" + randomCode + ".pdf");
  };

  return (
    <Card
      title="Reporte de Guardias"
      extra={
        <Space>
          <Button onClick={exportToExcel} className="excel-button">
            <FileExcelOutlined /> Exportar a Excel
          </Button>
          <Button onClick={exportToPDF} className="pdf-button">
            <FilePdfOutlined /> Exportar a PDF
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Select
          showSearch
          allowClear
          placeholder="Selecciona una estación"
          style={{ width: 250 }}
          value={selectedStation}
          onChange={setSelectedStation}
          optionFilterProp="children"
        >
          {stations.map((station) => (
            <Select.Option
              key={station.id_estacion}
              value={station.id_estacion}
            >
              {station.nombre}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Buscar
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(row) => row.id_registro}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default ReportGuard;
