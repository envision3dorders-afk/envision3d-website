import { useState, useEffect } from "react";
import { useForm } from "@formspree/react";

import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

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

  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  const total = cart.reduce(
    (sum, item) => (typeof item.price === "number" ? sum + item.price : sum),
    0
  );

  // ✅ SAVE ORDER
  const saveOrder = async () => {
    await addDoc(collection(db, "orders"), {
      ref: orderRef,
      items: cart,
      total,
      status: "Pending Payment",
      date: new Date().toISOString(),
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

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
  };

  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
  };

  // ✅ SUCCESS PAGE
  if (state.succeeded) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>✅ Order Received</h1>
        <h2>{orderRef}</h2>
      </div>
    );
  }

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
          <Products cart={cart} setCart={setCart} search={search} />
        )}

        {view === "cart" && (
          <Cart
            cart={cart}
            removeItem={(i) =>
              setCart(cart.filter((_, index) => index !== i))
            }
            total={total}
            startCheckout={() => {
              setOrderRef(generateOrderRef());
              setView("checkout");
            }}
          />
        )}

        {view === "checkout" && (
          <Checkout
            total={total}
            orderRef={orderRef}
            handleSubmit={handleSubmit}
          />
        )}

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
