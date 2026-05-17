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

  const filteredProducts =
    search.trim() === ""
      ? products
      : products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (!state) return <p>Loading...</p>;

  // ✅ Success screen
  if (state.succeeded) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img src={logo} alt="logo" style={{ width: "180px" }} />
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ✅ HERO SECTION */}
      <div style={{ position: "relative", width: "100%" }}>

        {/* ✅ Banner */}
        <img
          src={banner}
          alt="banner"
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* ✅ Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.35)",
          }}
        />

        {/* ✅ Logo + Text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "180px",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))",
            }}
          />

          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "18px",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            3D Printing Services
          </p>
        </div>
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
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                  }}
                />
              )}

              <h3>{p.name}</h3>
              <p>{p.price}</p>
            </div>
          ))}
        </div>

        {/* ✅ PRODUCT DETAIL */}
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

        {/* ✅ ORDER FORM */}
        {selectedProduct && (
          <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
            <h2>Order</h2>

            <input name="name" placeholder="Your Name" required />
            <br /><br />

            <input name="email" placeholder="Your Email" required />
            <br /><br />

            <input type="file" name="file" />
            <br /><br />

            <input
              type="hidden"
              name="product"
              value={selectedProduct.name}
            />

            <button type="submit">Submit Order</button>
          </form>
        )}

        {/* ✅ CONTACT */}
        <p style={{ marginTop: "40px" }}>
          Contact: orders@envision3d.co.za
        </p>
      </div>
    </div>
  );
}
