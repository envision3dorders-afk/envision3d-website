import { useState } from "react";
import { useForm } from "@formspree/react";

import logo from "./assets/logo-circle.jpeg";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [state, handleSubmit] = useForm("xgodnrrl");

  const products = [
    { id: 1, name: "Custom 3D Print", price: "Quote-Based" },
    { id: 2, name: "Phone Stand", price: "R120" },
    { id: 3, name: "Miniature Figurine", price: "R85" },
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
        <h1>✅ Order Received</h1>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ✅ HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#fff",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* ✅ LOGO FIXED */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logo}
            alt="Envision3D Logo"
            style={{ width: "40px", height: "40px" }}
          />
          <h2 style={{ margin: 0 }}>Envision3D</h2>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            margin: "0 20px",
            padding: "10px",
            maxWidth: "500px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* CONTACT */}
        <p style={{ fontSize: "14px" }}>
          orders@envision3d.co.za
        </p>
      </div>

      {/* ✅ PRODUCTS */}
      <div style={{ padding: "20px" }}>
        <h2>Products</h2>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                width: "250px",
                background: "#fff",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE PLACEHOLDER */}
              <div
                style={{
                  height: "120px",
                  background: "#eee",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />

              <h3>{p.name}</h3>

              <p
                style={{
                  fontWeight: "bold",
                  color: "#0070f3",
                }}
              >
                {p.price}
              </p>

              <button
                onClick={() => setSelectedProduct(p)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "8px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Order
              </button>

              <button
                style={{
                  marginTop: "5px",
                  width: "100%",
                  padding: "8px",
                  background: "#eee",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                View Model
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ORDER FORM */}
      {selectedProduct && (
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <h2>Order: {selectedProduct.name}</h2>

          <input name="name" placeholder="Name" required /><br /><br />
          <input name="email" placeholder="Email" required /><br /><br />
          <input type="file" name="file" /><br /><br />

          <button type="submit">Submit Order</button>
        </form>
      )}
    </div>
  );
}
``
