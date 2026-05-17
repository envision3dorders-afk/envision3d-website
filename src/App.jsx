import { useState } from "react";
import { useForm } from "@formspree/react";

// ✅ Import circle logo correctly
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
    <div style={{ fontFamily: "Arial" }}>

      {/* ✅ HEADER (FIXED LOGO) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          background: "#fff",
        }}
      >
        {/* ✅ FIXED IMAGE TAG */}
        <img
          src={logo}
          alt="Envision3D Logo"
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        />

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
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
              }}
            >
              <h3>{p.name}</h3>
              <p>{p.price}</p>

              <button
                onClick={() => setSelectedProduct(p)}
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  width: "100%",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Order
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
