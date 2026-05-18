import { useState, useEffect } from "react";
import { useForm } from "@formspree/react";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import logo from "./assets/logo-circle.jpeg";

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products");
  const [orderRef, setOrderRef] = useState("");
  const [orders, setOrders] = useState([]);
  const [state, handleSubmit] = useForm("xgodnrrl");

  // ✅ PRODUCTS
  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      description: "Upload your own 3D model",
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
      description: "Collector miniature",
    },
  ];

  // ✅ FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ ORDER REF
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ CART
  const addToCart = (product) => setCart([...cart, product]);

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  // ✅ SAVE ORDER (ONCE)
  const saveOrder = async () => {
    await addDoc(collection(db, "orders"), {
      ref: orderRef,
      items: cart,
      total: total,
      status: "Pending Payment",
      date: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (state.succeeded) {
      saveOrder();
    }
  }, [state.succeeded]);

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const data = [];

    snapshot.forEach((docSnap) => {
      data.push({ id: docSnap.id, ...docSnap.data() });
    });

    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
  };

  // ✅ SUCCESS PAGE
  if (state.succeeded) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>
        <h2 style={{ color: "#0070f3" }}>{orderRef}</h2>
        <p>Please use this reference when making payment.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        background: "#fff"
      }}>
        <h2 onClick={() => setView("products")} style={{ cursor: "pointer" }}>
          Envision3D
        </h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setView("cart")}>
          Cart ({cart.length})
        </button>

        <button onClick={() => {
          loadOrders();
          setView("orders");
        }}>
          Orders ({orders.length})
        </button>

        <img src={logo} alt="logo" style={{ width: "40px" }} />
      </div>

      {/* PRODUCTS */}
      {view === "products" && (
        <div style={{ padding: "20px" }}>
          <h2>Products</h2>

          {filteredProducts.map((p) => (
            <div key={p.id} style={{
              background: "#fff",
              padding: "15px",
              marginBottom: "10px"
            }}>
              {p.image ? (
                <img src={p.image} alt={p.name} width="200" />
              ) : (
                <div style={{ height: "140px", background: "#eee" }}>
                  Custom Upload
                </div>
              )}

              <h3>{p.name}</h3>
              <p>{p.description}</p>

              <p>
                <strong>
                  {typeof p.price === "number" ? `R${p.price}` : p.price}
                </strong>
              </p>

              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {/* CART */}
      {view === "cart" && (
        <div style={{ padding: "20px" }}>
          <h2>🛒 Cart</h2>

          {cart.map((item, i) => (
            <div key={i}>
              {item.name} -{" "}
              {typeof item.price === "number"
                ? `R${item.price}`
                : item.price}

              <button onClick={() => removeFromCart(i)}>Remove</button>
            </div>
          ))}

          <h3>Total: R{total}</h3>

          <button onClick={() => {
            setOrderRef(generateOrderRef());
            setView("checkout");
          }}>
            Checkout
          </button>
        </div>
      )}

      {/* CHECKOUT */}
      {view === "checkout" && (
        <div style={{ padding: "20px" }}>
          <h2>Checkout</h2>

          <p>Total: R{total}</p>
          <p>Reference: {orderRef}</p>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" required /><br /><br />
            <input name="email" placeholder="Email" required /><br /><br />

            <input type="hidden" name="orderRef" value={orderRef} />

            <button type="submit">Submit Order</button>
          </form>
        </div>
      )}

      {/* ✅ ORDERS DASHBOARD */}
      {view === "orders" && (
        <div style={{ padding: "20px" }}>
          <h2>📦 Orders</h2>

          {orders.map((o) => (
            <div key={o.id} style={{
              background: "#fff",
              padding: "15px",
              marginBottom: "10px"
            }}>
              <p><strong>{o.ref}</strong></p>
              <p>Total: R{o.total}</p>
              <p>Status: {o.status}</p>
              <p>Date: {new Date(o.date).toLocaleString()}</p>

              {/* ✅ STATUS BUTTONS */}
              <div>
                <button onClick={() => updateStatus(o.id, "Paid")}>
                  Paid
                </button>
                <button onClick={() => updateStatus(o.id, "Printing")}>
                  Printing
                </button>
                <button onClick={() => updateStatus(o.id, "Completed")}>
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
