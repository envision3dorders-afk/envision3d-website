import { useState, useEffect } from "react";
import { useForm } from "@formspree/react";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import logo from "./assets/logo-circle.jpeg";

export default function App() {

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products");
  const [orderRef, setOrderRef] = useState("");
  const [orders, setOrders] = useState([]);
  const [state, handleSubmit] = useForm("xgodnrrl");

  // ✅ STYLES (MakerWorld inspired)
  const containerStyle = {
    fontFamily: "Arial",
    background: "#0f1115",
    color: "#e5e7eb",
    minHeight: "100vh"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#0b0d11",
    borderBottom: "1px solid #2a2e37",
    alignItems: "center"
  };

  const cardStyle = {
    background: "#1c1f26",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #2a2e37"
  };

  const inputStyle = {
    padding: "8px",
    background: "#1c1f26",
    color: "#e5e7eb",
    border: "1px solid #2a2e37",
    borderRadius: "6px"
  };

  const buttonStyle = {
    padding: "8px 12px",
    marginRight: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#3b82f6",
    color: "#fff"
  };

  // ✅ PRODUCTS
  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      description: "Upload your own 3D model"
    },
    {
      id: 2,
      name: "Phone Stand",
      price: 120,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Phone+Stand",
      description: "Compact stand"
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: 85,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Miniature",
      description: "Mini collectible"
    }
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  const addToCart = (product) => setCart([...cart, product]);

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      typeof item.price === "number" ? sum + item.price : sum,
    0
  );

  // ✅ SAVE ORDER
  const saveOrder = async () => {
    await addDoc(collection(db, "orders"), {
      ref: orderRef,
      items: cart,
      total: total,
      status: "Pending Payment",
      date: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (state.succeeded) {
      saveOrder();
      setCart([]);
    }
  }, [state.succeeded]);

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const list = [];
    snapshot.forEach((docSnap) =>
      list.push({ id: docSnap.id, ...docSnap.data() })
    );
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
  };

  // ✅ DELETE ORDER
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
  };

  // ✅ STATUS COLOR
  const getStatusColor = (status) => {
    if (status === "Completed") return "#22c55e";
    if (status === "Printing") return "#3b82f6";
    if (status === "Paid") return "#a855f7";
    return "#f59e0b";
  };

  // ✅ SUCCESS PAGE
  if (state.succeeded) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>
        <h2 style={{ color: "#3b82f6" }}>{orderRef}</h2>
      </div>
    );
  }

  return (
    <div style={containerStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <h2 onClick={() => setView("products")} style={{ cursor: "pointer" }}>
          Envision3D
        </h2>

        <input
          style={inputStyle}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button style={buttonStyle} onClick={() => setView("cart")}>
          Cart ({cart.length})
        </button>

        <button
          style={buttonStyle}
          onClick={() => {
            loadOrders();
            setView("orders");
          }}
        >
          Orders ({orders.length})
        </button>

        {/* ✅ FIXED LOGO */}
        <img
          src={logo}
          alt="logo"
          style={{ width: "40px", borderRadius: "50%" }}
        />
      </div>

      <div style={{ padding: "30px" }}>

        {/* PRODUCTS */}
        {view === "products" && (
          <>
            <h2>Products</h2>

            {filteredProducts.map((p) => (
              <div key={p.id} style={cardStyle}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "200px",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                  />
                ) : (
                  <div style={{ height: "140px", background: "#333" }} />
                )}

                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p>{typeof p.price === "number" ? `R${p.price}` : p.price}</p>

                <button style={buttonStyle} onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </>
        )}

        {/* CART */}
        {view === "cart" && (
          <>
            <h2>Cart</h2>

            {cart.map((item, i) => (
              <div key={i} style={cardStyle}>
                {item.name} - {item.price}
                <button onClick={() => removeFromCart(i)}>Remove</button>
              </div>
            ))}

            <h3>Total: R{total}</h3>

            <button
              style={buttonStyle}
              onClick={() => {
                setOrderRef(generateOrderRef());
                setView("checkout");
              }}
            >
              Checkout
            </button>
          </>
        )}

        {/* CHECKOUT */}
        {view === "checkout" && (
          <div style={cardStyle}>
            <h2>Checkout</h2>

            <p>Total: R{total}</p>
            <p>Reference: {orderRef}</p>

            <form onSubmit={handleSubmit}>
              <input style={inputStyle} name="name" placeholder="Name" required /><br /><br />
              <input style={inputStyle} name="email" placeholder="Email" required /><br /><br />

              <input type="hidden" name="orderRef" value={orderRef} />

              <button style={buttonStyle} type="submit">
                Submit Order
              </button>
            </form>
          </div>
        )}

        {/* ORDERS */}
        {view === "orders" && (
          <>
            <h2>📦 Orders</h2>

            {orders.map((o) => (
              <div key={o.id} style={cardStyle}>
                <p><strong>{o.ref}</strong></p>
                <p>Total: R{o.total}</p>

                <p style={{ color: getStatusColor(o.status) }}>
                  Status: {o.status}
                </p>

                <button style={buttonStyle} onClick={() => updateStatus(o.id, "Paid")}>Paid</button>
                <button style={buttonStyle} onClick={() => updateStatus(o.id, "Printing")}>Printing</button>
                <button style={buttonStyle} onClick={() => updateStatus(o.id, "Completed")}>Completed</button>

                <button
                  style={{ ...buttonStyle, background: "red" }}
                  onClick={() => deleteOrder(o.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
