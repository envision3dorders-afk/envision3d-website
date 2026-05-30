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

  // ✅ IMPORTANT: this now stores the FIRESTORE ID (not just ref)
  const [orderId, setOrderId] = useState("");

  const [orders, setOrders] = useState([]);

  // ✅ Generate display reference
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

  // ✅ START CHECKOUT (CREATE ORDER FIRST)
  const startCheckout = async () => {
    const ref = generateOrderRef();

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ref,
        items: cart,
        total,
        status: total > 0 ? "Pending Payment" : "Quote Required",
        date: new Date().toISOString(),
      });

      // ✅ SAVE THE REAL ORDER ID
      setOrderId(docRef.id);

      setView("checkout");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // ✅ HANDLE FILE + LINK (FIXED)
  const handleFileUpload = async ({ fileURL, modelLink }) => {
    try {
      // ✅ UPDATE THE EXACT ORDER (NO MORE "LAST ORDER" LOGIC)
      await updateDoc(doc(db, "orders", orderId), {
        fileURL: fileURL || null,
        modelLink: modelLink || null,
        status: "Quote Required",
      });

      await loadOrders();

      setCart([]);
      setView("orders");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // ✅ SET PRICE (ADMIN)
  const setPrice = async (id, price) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        total: price,
        status: "Pending Payment",
      });

      loadOrders();
    } catch (error) {
      console.error("Error setting price:", error);
    }
  };

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

  return (
    <div>
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
              setCart(cart.filter((_, index) => index !== i))
            }
            startCheckout={startCheckout}
          />
        )}

        {/* ✅ CHECKOUT */}
        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={orderId}
            onFileUpload={handleFileUpload}
          />
        )}

        {/* ✅ ORDERS */}
        {view === "orders" && (
          <Orders
            orders={orders}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
            setPrice={setPrice}
          />
        )}
      </div>
    </div>
  );
}
