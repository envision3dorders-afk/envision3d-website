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

// ✅ IMPORT COMPONENTS FROM FOLDER
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

  // ✅ GENERATE ORDER REF
  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  // ✅ TOTAL
  const total = cart.reduce(
    (sum, item) => (typeof item.price === "number" ? sum + item.price : sum),
    0
  );

  // ✅ SAVE ORDER TO FIREBASE
  const saveOrder = async () => {
    await addDoc(collection(db, "orders"), {
      ref: orderRef,
      items: cart,
      total: total,
      status: "Pending Payment",
      date: new Date().toISOString(),
    });
  };

  // ✅ ONLY SAVE ON SUBMIT SUCCESS
  useEffect(() => {
    if (state.succeeded) {
      saveOrder();
      setCart([]); // clear cart after order
    }
  }, [state.succeeded]);

  // ✅ LOAD ORDERS
  const loadOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const list = [];

    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });

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

  // ✅ SUCCESS SCREEN
  if (state.succeeded) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>
        <h2>{orderRef}</h2>
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

        {/* ✅ PRODUCTS */}
        {view === "products" && (
          <Products
            cart={cart}
            setCart={setCart}
            search={search}
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
            startCheckout={() => {
              setOrderRef(generateOrderRef());
              setView("checkout");
            }}
          />
        )}

        {/* ✅ CHECKOUT */}
        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={orderRef}
            handleSubmit={handleSubmit}
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
