import { useState, useEffect } from "react";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
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

  // ✅ GENERATE ORDER REF
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ CALCULATE TOTAL
  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  // ✅ LOAD ORDERS FROM FIREBASE
  const loadOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setOrders(list);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ UPDATE ORDER STATUS
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

  // ✅ START CHECKOUT (SAVE ORDER BEFORE PAYMENT)
  const startCheckout = async () => {
    const ref = generateOrderRef();
    setOrderRef(ref);

    try {
      await addDoc(collection(db, "orders"), {
        ref: ref,
        items: cart,
        total: total,
        status: "Pending Payment",
        date: new Date().toISOString(),
      });

      setView("checkout");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

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
        {/* ✅ PRODUCTS */}
        {view === "products" && (
          <Products cart={cart} setCart={setCart} search={search} />
        )}

        {/* ✅ CART */}
        {view === "cart" && (
          <Cart
            cart={cart}
            total={total}
            removeItem={(i) =>
              setCart(cart.filter((_, index) => index !== i))
            }
            startCheckout={startCheckout} // ✅ UPDATED
          />
        )}

        {/* ✅ CHECKOUT (PAYFAST) */}
        {view === "checkout" && (
          <Checkout total={total} orderRef={orderRef} />
        )}

        {/* ✅ ORDERS */}
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
