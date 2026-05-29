export default function Checkout({ total, orderRef }) {
  const merchant_id = "10000100"; // Sandbox default
  const merchant_key = "46f0cd694581a"; // Sandbox default
  const return_url = "https://your-site.vercel.app";
  const cancel_url = "https://your-site.vercel.app";
  const notify_url = "https://your-site.vercel.app"; // later we improve this

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      <form
        action="https://sandbox.payfast.co.za/eng/process"
        method="post"
      >
        <input type="hidden" name="merchant_id" value={merchant_id} />
        <input type="hidden" name="merchant_key" value={merchant_key} />

        <input type="hidden" name="return_url" value={return_url} />
        <input type="hidden" name="cancel_url" value={cancel_url} />
        <input type="hidden" name="notify_url" value={notify_url} />

        <input type="hidden" name="amount" value={total} />
        <input type="hidden" name="item_name" value="Envision3D Order" />
        <input type="hidden" name="m_payment_id" value={orderRef} />

        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            name="email_address"
            placeholder="Email"
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
