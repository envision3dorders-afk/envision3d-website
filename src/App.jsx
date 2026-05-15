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
      link: null,
    },
    {
      id: 2,
      name: "Phone Stand",
      price: "R120",
      embed: "https://www.thingiverse.com/thing:1952405/embed",
      link: "https://www.thingiverse.com/thing:1952405",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: "R85",
      embed: "https://www.thingiverse.com/thing:763622/embed",
      link: "https://www.thingiverse.com/thing:763622",
    },
  ];

  // Filter products
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
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              background: "#fff",
            }}
          >
            <h3>{p.name}</h3>
            <p>{p.price}</p>
          </div>
        ))}
      </div>

      {/* MODEL PREVIEW */}
      {selectedProduct && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h2>Preview: {selectedProduct.name}</h2>

          {selectedProduct.embed ? (
            <iframe
              src={selectedProduct.embed}
              width="100%"
              height="400"
              style={{ border: "none", background: "#f0f0f0" }}
              title="3D Model Preview"
            ></iframe>
          ) : (
            <p>This is a custom print. Provide your design details below.</p>
          )}

          {/* FALLBACK LINK */}
          {selectedProduct.link && (
            <p style={{ marginTop: "10px" }}>
              Can’t see the model?{" "}
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Thingiverse
              </a>
            </p>
          )}
        </div>
      )}

      {/* ORDER FORM */}
      {selectedProduct && (
        <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
          <h2>Order: {selectedProduct.name}</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "400px",
            }}
          >
            <input
              name="name"
              placeholder="Your Name"
              required
              style={{ marginBottom: "10px", padding: "8px" }}
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
