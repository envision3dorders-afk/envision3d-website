import { useState } from "react";
import { useForm } from "@formspree/react";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [state, handleSubmit] = useForm("xgodnrrl");

  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      embed: null,
    },
    {
      id: 2,
      name: "Phone Stand",
      price: "R120",
      embed: "https://www.thingiverse.com/thing:2234200/embed",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: "R85",
      embed: "https://www.thingiverse.com/thing:2818959/embed",
    },
  ];

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!state) return <p>Loading...</p>;

  if (state.succeeded) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Envision3D</h1>
      <p>3D Printing Services</p>

      {/* SEARCH */}
      <input
        placeholder="Search models..."
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
        }}
      />

      {/* PRODUCTS */}
      <h2>Products</h2>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            style={{
              cursor: "pointer",
