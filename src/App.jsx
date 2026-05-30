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

import Header from "./components/Header";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products");
  const [orders, setOrders] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const total = cart.reduce(
    (sum, item) =>
      typeof item.price === "number" ? sum + item.price : sum,
    0
  );

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ CREATE ORDER
  const startCheckout = async () => {
    console.log("Creating order...");

    const docRef = await addDoc(collection(db, "orders"), {
      items: cart,
      total,
      status: total === 0 ? "Quote Required" : "Pending Payment",
      date: new Date().toISOString(),
    });

    console.log("Order created:", docRef.id);

    setCurrentOrderId(docRef.id);
    setView("checkout");
  };

  // ✅ HANDLE QUOTE SUBMISSION
  const handleFileUpload = async ({ fileURL, modelLink }) => {
    if (!currentOrderId) {
      console.error("No order ID!");
      return;
    }

    await updateDoc(doc(db, "orders", currentOrderId), {
      modelLink: modelLink || null,
    });

    await loadOrders();

    setCart([]);
    setView("orders");
  };

  // ✅ ADMIN ACTIONS
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
  };

  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
  };

  const setPrice = async (id, price) => {
    await updateDoc(doc(db, "orders", id), {
      total: price,
      status: "Pending Payment",
    });
    loadOrders();
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

      {view === "products" && (
        <Products
          cart={cart}
          setCart={setCart}
          search={search}
          setView={setView}
        />
      )}

      {view === "cart" && (
        <Cart
          cart={cart}
          total={total}
          startCheckout={startCheckout}
        />
      )}

      {view === "checkout" && (
        <Checkout
          total={total}
          onFileUpload={handleFileUpload}
        />
      )}

      {view === "orders" && (
        <Orders
          orders={orders}
          updateStatus={updateStatus}
          deleteOrder={deleteOrder}
          setPrice={setPrice}
        />
      )}
    </div>
  );
}
