"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        MovieWebApp ©{new Date().getFullYear()} Created by Group 6
      </Footer>
    </>
  );
};

export default AdminFooter;
