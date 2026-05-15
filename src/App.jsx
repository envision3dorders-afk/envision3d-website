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
      image: null,
      link: null,
    },
    {
      id: 2,
      name: "Phone Stand",
      price: "R120",
      image: "https://via.placeholder.com/250",
      link: "https://makerworld.com/",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: "R85",
      image: "https://via.placeholder.com/250",
      link: "https://www.crealitycloud.com/",
    },
  ];

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
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", marginBottom: "10px" }}
              />
            )}
            <h3>{p.name}</h3>
            <p>{p.price}</p>
          </div>
        ))}
      </div>

      {/* MODEL INFO */}
      {selectedProduct && (
        <div style={{ marginTop: "30px" }}>
          <h2>{selectedProduct.name}</h2>

          {selectedProduct.link && (
            <p>
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Model
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
            <input name="name" placeholder="Your Name" required />
            <input name="email" type="email" placeholder="Your Email" required />
            <input name="material" placeholder="Material" />
            <input name="color" placeholder="Color" />
            <input name="quantity" type="number" defaultValue="1" />
            <textarea name="details" placeholder="Describe your request" />

            <input type="hidden" name="product" value={selectedProduct.name} />

            <button type="submit" disabled={state.submitting}>
              {state.submitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </form>
      )}

      <p style={{ marginTop: "40px" }}>
        Contact: orders@envision3d.co.za
      </p>
    </div>
  );
}
