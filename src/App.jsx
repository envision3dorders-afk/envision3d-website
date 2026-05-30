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

  const generateOrderRef = () =>
    "ENV-" + Math.floor(10000 + Math.random() * 90000);

  const total = cart.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price : sum;
  }, 0);

  const loadOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setOrders(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ START CHECKOUT
  const startCheckout = async () => {
    const ref = generateOrderRef();
    setOrderRef(ref);

    await addDoc(collection(db, "orders"), {
      ref,
      items: cart,
      total,
      status: total > 0 ? "Pending Payment" : "Quote Required",
      date: new Date().toISOString(),
    });

    setView("checkout");
  };

  // ✅ SET PRICE (NEW FUNCTION)
  const setPrice = async (id, price) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        total: price,
        status: "Pending Payment",
      });

      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ DELETE
  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ HANDLE FILE/LINK
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

      loadOrders();
      setCart([]);
      setView("orders");
    } catch (error) {
      console.error(error);
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
            orderRef={orderRef}
            onFileUpload={handleFileUpload}
          />
        )}

        {view === "orders" && (
          <Orders
            orders={orders}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
            setPrice={setPrice} // ✅ NEW
          />
        )}
      </div>
    </div>
  );
}
