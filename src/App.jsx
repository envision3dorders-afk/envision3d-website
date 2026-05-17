import { useState } from "react";
import { useForm } from "@formspree/react";

import logo from "./assets/logo-circle.jpeg";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // ✅ NEW CART STATE
  const [state, handleSubmit] = useForm("xgodnrrl");

  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      description: "Upload your own 3D model for custom printing",
    },
    {
      id: 2,
      name: "Phone Stand",
      price: 120,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Phone+Stand",
      description: "Compact and durable stand for smartphones",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: 85,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Miniature",
      description: "Detailed miniature perfect for collectors",
    },
  ];

  const filteredProducts =
    search.trim() === ""
      ? products
      : products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (!state) return <p>Loading...</p>;

  // ✅ ADD TO CART FUNCTION
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // ✅ CALCULATE TOTAL
  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

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
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#fff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Envision3D</h2>

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

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p style={{ margin: 0 }}>orders@envision3d.co.za</p>

          {logo}
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

        {/* ✅ PRODUCTS */}
        <div style={{ flex: 3 }}>
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
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <div style={{ height: "140px", background: "#eee" }}>
                    Custom Upload
                  </div>
                )}

                <h3>{p.name}</h3>

                <p style={{ fontSize: "14px" }}>{p.description}</p>

                <p style={{ fontWeight: "bold", color: "#0070f3" }}>
                  {typeof p.price === "number" ? `R${p.price}` : p.price}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => setSelectedProduct(p)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#eee",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ CART PANEL */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            height: "fit-content",
          }}
        >
          <h3>🛒 Cart</h3>

          {cart.length === 0 ? (
            <p>No items yet</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    marginBottom: "10px",
                    paddingBottom: "5px",
                  }}
                >
                  <p>{item.name}</p>
                  <p>
                    {typeof item.price === "number"
                      ? `R${item.price}`
                      : item.price}
                  </p>

                  <button onClick={() => removeFromCart(index)}>
                    Remove
                  </button>
                </div>
              ))}

              <h4>Total: R{total}</h4>
            </>
          )}
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
