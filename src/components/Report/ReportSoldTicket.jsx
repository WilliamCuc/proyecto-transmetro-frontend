import React, { useEffect, useState } from "react";
import { Table, Card, message, Button, Space, DatePicker } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { reportApiService } from "../../api/report/reportApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import "./Report.css";

const { RangePicker } = DatePicker;

const ReportSoldTicket = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(false);
  let randomCode = Math.floor(Math.random() * 1000000);

  const fetchReport = async (fecha_inicio = null, fecha_fin = null) => {
    setLoading(true);
    try {
      const result = await reportApiService.getSoldTicket(
        fecha_inicio,
        fecha_fin
      );
      setData(result);
    } catch (error) {
      message.error("Error al cargar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSearch = () => {
    if (dateRange && dateRange.length === 2) {
      fetchReport(
        dateRange[0].format("YYYY-MM-DD"),
        dateRange[1].format("YYYY-MM-DD")
      );
    } else {
      fetchReport();
    }
  };

  const columns = [
    { title: "No. Boleto", dataIndex: "numero_boleto", key: "numero_boleto" },
    { title: "Usuario", dataIndex: "usuario", key: "usuario" },
    { title: "Correo", dataIndex: "correo", key: "correo" },
    {
      title: "Fecha de compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
    },
    { title: "Ruta", dataIndex: "ruta", key: "ruta" },
    { title: "Precio", dataIndex: "precio", key: "precio" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReporteBoletos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ReporteBoletos_" + randomCode + ".xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Boletos Vendidos", 14, 10);
    autoTable(doc, {
      head: [columns.map((col) => col.title)],
      body: data.map((row) => columns.map((col) => row[col.dataIndex])),
      startY: 20,
    });
    doc.save("ReporteBoletos_" + randomCode + ".pdf");
  };

  return (
    <Card
      title="Reporte de Boletos Vendidos"
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
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format="YYYY-MM-DD"
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Buscar
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(row) => row.numero_boleto}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default ReportSoldTicket;
