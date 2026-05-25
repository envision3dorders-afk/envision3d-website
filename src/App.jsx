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

// ✅ COMPONENT IMPORTS
import Header from "./components/Header";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";

export default function App() {

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products");
  const [orderRef, setOrderRef] = useState("");
  const [orders, setOrders] = useState([]);

  const [state, handleSubmit] = useForm("xgodnrrl");

  // ✅ GENERATE ORDER REFERENCE
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ CALCULATE TOTAL
  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  // ✅ SAVE ORDER
  const saveOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        ref: orderRef,
        items: cart,
        total: total,
        status: "Pending Payment",
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // ✅ ONLY SAVE AFTER SUCCESS
  useEffect(() => {
    if (state.succeeded) {
      saveOrder();
      setCart([]);
    }
  }, [state.succeeded]);

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const list = [];

      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      setOrders(list);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      loadOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ DELETE ORDER
  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      loadOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // ✅ SUCCESS SCREEN
  if (state.succeeded) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>
        <h2 style={{ color: "#3b82f6" }}>{orderRef}</h2>
        <p>Please use this reference when making payment.</p>
      </div>
    );
  }

  return (
    <div>

      {/* ✅ HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
        cart={cart}
        orders={orders}
        setView={setView}
      />

      <div style={{ padding: "30px" }}>

        {/* ✅ PRODUCTS VIEW */}
        {view === "products" && (
          <Products
            cart={cart}
            setCart={setCart}
            search={search}
          />
        )}

        {/* ✅ CART VIEW */}
        {view === "cart" && (
          <Cart
            cart={cart}
            total={total}
            removeItem={(i) =>
              setCart(cart.filter((_, index) => index !== i))
            }
            startCheckout={() => {
              setOrderRef(generateOrderRef());
              setView("checkout");
            }}
          />
        )}

        {/* ✅ CHECKOUT VIEW */}
        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={orderRef}
            handleSubmit={handleSubmit}
          />
        )}

        {/* ✅ ORDERS VIEW */}
        {view === "orders" && (
          <Orders
            orders={orders}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
          />
        )}

      </div>
    </div>
  );
}
