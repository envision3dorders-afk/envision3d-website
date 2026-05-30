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

  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [orders, setOrders] = useState([]);

  // ✅ Generate readable order reference
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  const total = cart.reduce(
    (sum, item) =>
      typeof item.price === "number" ? sum + item.price : sum,
    0
  );

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ CREATE ORDER
  const startCheckout = async () => {
    const ref = generateOrderRef();

    const docRef = await addDoc(collection(db, "orders"), {
      ref,
      items: cart,
      total,
      status: total > 0 ? "Pending Payment" : "Quote Required",
      date: new Date().toISOString(),
    });

    // ✅ Save correct Firestore ID
    setCurrentOrderId(docRef.id);

    setView("checkout");
  };

  // ✅ FILE / LINK SAVE (FIXED)
  const handleFileUpload = async ({ fileURL, modelLink }) => {
    if (!currentOrderId) {
      console.error("No order ID found");
      return;
    }

    await updateDoc(doc(db, "orders", currentOrderId), {
      fileURL: fileURL || null,
      modelLink: modelLink || null,
    });

    await loadOrders();

    setCart([]);
    setView("orders");
  };

  // ✅ SET PRICE
  const setPrice = async (id, price) => {
    await updateDoc(doc(db, "orders", id), {
      total: price,
      status: "Pending Payment",
    });
    loadOrders();
  };

  // ✅ STATUS UPDATE
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
  };

  // ✅ DELETE
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
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

      <div style={{ padding: "30px" }}>
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
            removeItem={(i) =>
              setCart(cart.filter((_, idx) => idx !== i))
            }
            startCheckout={startCheckout}
          />
        )}

        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={currentOrderId}
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
    </div>
  );
}
