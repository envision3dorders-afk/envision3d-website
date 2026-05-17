import { useState } from "react";
import { useForm } from "@formspree/react";

// ✅ Use your actual file names (.jpeg)
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
      image:
        "https://dummyimage.com/250x150/cccccc/000000&text=Phone+Stand",
      link: "https://makerworld.com/en",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: "R85",
      image:
        "https://dummyimage.com/250x150/cccccc/000000&text=Miniature",
      link: "https://www.crealitycloud.com/",
    },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!state) return <p>Loading...</p>;

  // ✅ SUCCESS PAGE
  if (state.succeeded) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
        <img src={logo} alt="logo" style={{ maxWidth: "250px" }} />
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>
      
      {/* ✅ HEADER */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img src={logo} alt="logo" style={{ maxWidth: "250px" }} />
        <p>3D Printing Services</p>
      </div>

      {/* ✅ BANNER */}
      <img
        src={banner}
        alt="banner"
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />

      {/* ✅ MAIN CONTENT */}
      <div
        style={{
          padding: "20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
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
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              )}

              <h3>{p.name}</h3>
              <p>{p.price}</p>
            </div>
          ))}
        </div>

        {/* SELECTED PRODUCT */}
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
                gap: "10px",
              }}
            >
              <input name="name" placeholder="Your Name" required />
              <input name="email" type="email" placeholder="Your Email" required />
              <input name="material" placeholder="Material (PLA, ABS...)" />
              <input name="color" placeholder="Color" />
              <input name="quantity" type="number" defaultValue="1" />

              {/* ✅ FILE UPLOAD */}
              <label>Upload your 3D file (STL/OBJ):</label>
              <input type="file" name="file" accept=".stl,.obj" />

              <textarea
                name="details"
                placeholder="Describe your request"
              ></textarea>

              <input
                type="hidden"
                name="product"
                value={selectedProduct.name}
              />

              <button
                type="submit"
                disabled={state.submitting}
                style={{
                  padding: "10px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                {state.submitting ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </form>
        )}

        {/* CONTACT */}
        <p style={{ marginTop: "40px", fontSize: "14px", color: "#555" }}>
          Contact: orders@envision3d.co.za
        </p>
      </div>
    </div>
  );
}
