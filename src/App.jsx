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

  // ✅ Store Firestore document ID
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const [orders, setOrders] = useState([]);

  // ✅ Generate nice-looking order ref
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ Calculate total
  const total = cart.reduce(
    (sum, item) =>
      typeof item.price === "number" ? sum + item.price : sum,
    0
  );

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));

      console.log("Orders loaded:", snapshot.docs.length);

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

  // ✅ CREATE ORDER
  const startCheckout = async () => {
    const ref = generateOrderRef();

    console.log("Creating order...");

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ref,
        items: cart,
        total,
        // ✅ FIXED LOGIC
        status: total === 0 ? "Quote Required" : "Pending Payment",
        date: new Date().toISOString(),
      });

      console.log("Order created:", docRef.id);

      setCurrentOrderId(docRef.id);

      setView("checkout");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // ✅ HANDLE FILE / LINK SUBMISSION
  const handleFileUpload = async ({ fileURL, modelLink }) => {
    if (!currentOrderId) {
      console.error("No order ID found!");
      return;
    }

    try {
      console.log("Updating order:", currentOrderId);

      await updateDoc(doc(db, "orders", currentOrderId), {
        fileURL: fileURL || null,
        modelLink: modelLink || null,
        status: "Quote Required",
      });

      await loadOrders();

      setCart([]); // ✅ clear cart
      setView("orders"); // ✅ go to Orders screen
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // ✅ ADMIN: SET PRICE
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

  // ✅ DELETE
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
            orderRef={currentOrderId}
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
