import { useState } from "react";
import { useForm } from "@formspree/react";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [state, handleSubmit] = useForm("xgodnrrl");

  const products = [
    { id: 1, name: "Custom 3D Print", price: "Quote-Based" },
    { id: 2, name: "Phone Stand", price: "R120" },
    { id: 3, name: "Miniature Figurine", price: "R85" },
  ];

  if (!state) {
    return <p>Loading...</p>;
  }

  if (state.succeeded) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>✅ Order Received</h1>
        <p>We will contact you from orders@envision3d.co.za</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Envision3D</h1>
      <p>3D Printing Services</p>

      <h2>Products</h2>
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => setSelectedProduct(p)}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          <h3>{p.name}</h3>
          <p>{p.price}</p>
        </div>
      ))}

      {selectedProduct && (
        <form onSubmit={handleSubmit}>
          <h2>Order: {selectedProduct.name}</h2>

          <input name="name" placeholder="Your Name" required /><br /><br />
          <input name="email" type="email" placeholder="Your Email" required /><br /><br />
          <input name="material" placeholder="Material" /><br /><br />
          <input name="color" placeholder="Color" /><br /><br />
          <input name="quantity" type="number" defaultValue="1" /><br /><br />

          <textarea name="details" placeholder="Describe your request" /><br /><br />

          <input type="hidden" name="product" value={selectedProduct.name} />

          <button type="submit" disabled={state.submitting}>
            {state.submitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      )}
    </div>
  );
}
