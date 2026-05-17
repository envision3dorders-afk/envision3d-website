import { useState } from "react";
import { useForm } from "@formspree/react";

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

import logo from "./assets/logo-circle.jpeg";

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products");
  const [orderRef, setOrderRef] = useState("");
  const [state, handleSubmit] = useForm("xgodnrrl");

  // ✅ PRODUCTS
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
      description: "Compact stand for smartphones",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: 85,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Miniature",
      description: "Detailed miniature for collectors",
    },
  ];

  // ✅ SEARCH FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ ORDER REFERENCE
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ CART FUNCTIONS
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // ✅ TOTAL
  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  // ✅ SAVE ORDER (FIREBASE)
  const saveOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        ref: orderRef,
        items: cart,
        total: total,
        status: "Pending Payment",
        date: new Date().toISOString(),
      });
      console.log("✅ Order saved to Firebase");
    } catch (error) {
      console.error("❌ Firebase error:", error);
    }
  };

  // ✅ SUCCESS SCREEN
  if (state.succeeded) {
    saveOrder();

    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>

        <h2 style={{ color: "#0070f3", fontSize: "28px" }}>
          {orderRef}
        </h2>

        <p>Please use the reference above when making payment.</p>

        <p>
          Once payment is received, we will confirm and begin printing your order.
        </p>
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
          background: "#ffffff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2 onClick={() => setView("products")} style={{ cursor: "pointer" }}>
          Envision3D
        </h2>

        <input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            margin: "0 20px",
            padding: "8px",
          }}
        />

        <button onClick={() => setView("cart")}>
          Cart ({cart.length})
        </button>

        {/* ✅ LOGO */}
        <img src={logo} alt="logo" style={{ width: "40px" }} />
      </div>

      {/* ✅ PRODUCTS */}
      {view === "products" && (
        <div style={{ padding: "20px" }}>
          <h2>Products</h2>

          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", maxWidth: "200px" }}
                />
              ) : (
                <div style={{ height: "140px", background: "#eee" }}>
                  Custom Upload
                </div>
              )}

              <h3>{p.name}</h3>
              <p>{p.description}</p>

              <p>
                <strong>
                  {typeof p.price === "number"
                    ? `R${p.price}`
                    : p.price}
                </strong>
              </p>

              <button onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ CART */}
      {view === "cart" && (
        <div style={{ padding: "20px" }}>
          <h2>🛒 Cart</h2>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i}>
                  {item.name} -{" "}
                  {typeof item.price === "number"
                    ? `R${item.price}`
                    : item.price}

                  <button onClick={() => removeFromCart(i)}>
                    Remove
                  </button>
                </div>
              ))}

              <h3>Total: R{total}</h3>

              <button
                onClick={() => {
                  setOrderRef(generateOrderRef());
                  setView("checkout");
                }}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* ✅ CHECKOUT */}
      {view === "checkout" && (
        <div style={{ padding: "20px" }}>
          <h2>Checkout</h2>

          <h3>Total: R{total}</h3>

          <h3 style={{ color: "#0070f3" }}>
            Reference: {orderRef}
          </h3>

          <h4>Banking Details</h4>
          <p><strong>Bank:</strong> ABSA</p>
          <p><strong>Account Name:</strong> AJ Rautenbach</p>
          <p><strong>Account Type:</strong> Savings</p>
          <p><strong>Account Number:</strong> 9377967059</p>
          <p><strong>Branch Code:</strong> 632005</p>

          <p style={{ color: "red", fontWeight: "bold" }}>
            ⚠️ Use this reference exactly when making payment
          </p>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" required />
            <br /><br />

            <input name="email" placeholder="Email" required />
            <br /><br />

            <input type="hidden" name="orderRef" value={orderRef} />

            <button type="submit">Submit Order</button>
          </form>
        </div>
      )}
    </div>
  );
}
