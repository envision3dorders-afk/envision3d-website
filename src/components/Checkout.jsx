export default function Checkout({ total, orderRef, handleSubmit }) {
  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="name"
            placeholder="Name"
            required
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "300px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "300px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* ✅ Hidden reference sent to Formspree */}
        <input type="hidden" name="orderRef" value={orderRef} />

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            borderRadius: "6px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
