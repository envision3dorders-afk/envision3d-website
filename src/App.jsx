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

// ✅ COMPONENTS
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

  // ✅ Generate order reference
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ Calculate total
  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  // ✅ Load orders
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

  // ✅ Update order status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      loadOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ Delete order
  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      loadOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // ✅ Start checkout (create order first)
  const startCheckout = async () => {
    const ref = generateOrderRef();
    setOrderRef(ref);

    try {
      await addDoc(collection(db, "orders"), {
        ref: ref,
        items: cart,
        total: total,
        status: total > 0 ? "Pending Payment" : "Quote Required",
        date: new Date().toISOString(),
      });

      setView("checkout");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // ✅ Handle file + link from Checkout
  const handleFileUpload = async ({ fileURL, modelLink }) => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const lastOrder = snapshot.docs[snapshot.docs.length - 1];

      if (lastOrder) {
        await updateDoc(doc(db, "orders", lastOrder.id), {
          fileURL: fileURL || null,
          modelLink: modelLink || null,
          status: "Quote Required",
        });
      }

      await loadOrders();
      setCart([]); // ✅ clear cart after submission
      setView("orders"); // ✅ go to orders page
    } catch (error) {
      console.error("Error updating order:", error);
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
          <Products
            cart={cart}
            setCart={setCart}
            search={search}
            setView={setView}
          />
        )}

        {/* ✅ CART */}
        {view === "cart" && (
          <Cart
            cart={cart}
            total={total}
            removeItem={(i) =>
              setCart(cart.filter((_, idx) => idx !== i))
            }
            startCheckout={startCheckout}
          />
        )}

        {/* ✅ CHECKOUT */}
        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={orderRef}
            onFileUpload={handleFileUpload}
          />
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
