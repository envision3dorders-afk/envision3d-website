import { useState } from "react";
import { useForm } from "@formspree/react";

// ✅ Images
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

  // ✅ Safe filtering (no disappearing products)
  const filteredProducts =
    search.trim() === ""
      ? products
      : products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (!state) return <p>Loading...</p>;

  // ✅ Success message
  if (state.succeeded) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
        <img src={logo} alt="Logo" style={{ width: "200px" }} />
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ✅ HEADER */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img src={logo} alt="Logo" style={{ width: "200px" }} />
        <p style={{ marginTop: "10px" }}>3D Printing Services</p>
      </div>

      {/* ✅ BANNER */}
      <div style={{ width: "100%" }}>
        <img
          src={banner}
          alt="Banner"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* ✅ MAIN CONTENT */}
      <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>

        {/* SEARCH */}
        <input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
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
                width: "250px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                cursor: "pointer",
                background: "#fff",
              }}
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
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Model
              </a>
            )}
          </div>
        )}

        {/* ORDER FORM */}
        {selectedProduct && (
          <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
            <h2>Order</h2>

            <input name="name" placeholder="Name" required />
            <br /><br />

            <input name="email" placeholder="Email" required />
            <br /><br />

            <input type="file" name="file" />
            <br /><br />

            <input
              type="hidden"
              name="product"
              value={selectedProduct.name}
            />

            <button type="submit">Submit</button>
          </form>
        )}

        {/* CONTACT */}
        <p style={{ marginTop: "40px" }}>
          Contact: orders@envision3d.co.za
        </p>
      </div>
    </div>
  );
}
