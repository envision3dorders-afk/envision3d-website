import { useState } from "react";
import { useForm } from "@formspree/react";

import banner from "./assets/banner.jpeg";
import logo from "./assets/logo.jpeg";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [state, handleSubmit] = useForm("xgodnrrl");

  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      link: null,
    },
    {
      id: 2,
      name: "Phone Stand",
      price: "R120",
      image: "https://dummyimage.com/250x150/cccccc/000000&text=Phone+Stand",
      link: "https://makerworld.com/en",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: "R85",
      image: "https://dummyimage.com/250x150/cccccc/000000&text=Miniature",
      link: "https://www.crealitycloud.com/",
    },
  ];

  const filteredProducts =
    search.trim() === ""
      ? products
      : products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (!state) return <p>Loading...</p>;

  if (state.succeeded) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img src={logo} alt="logo" style={{ width: "200px" }} />
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ✅ HEADER */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img src={logo} alt="logo" style={{ width: "200px" }} />
        <p style={{ marginTop: "10px" }}>3D Printing Services</p>
      </div>

      {/* ✅ BANNER */}
      <div>
        <img
          src={banner}
          alt="banner"
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* ✅ MAIN */}
      <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        
        {/* SEARCH */}
        <input
          placeholder="Search models..."
          value={search}
