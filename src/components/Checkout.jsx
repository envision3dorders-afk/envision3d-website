export default function Checkout({ total, orderRef }) {
  // ✅ PayFast Sandbox Credentials (Testing)
  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";

  // ✅ Replace with your ACTUAL deployed site URL
  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const cancel_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const notify_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      {/* ✅ PAYFAST FORM (THIS IS CRITICAL) */}
      <form
        action="https://sandbox.payfast.co.za/eng/process"
        method="POST"
      >
        {/* Merchant Details */}
        <input type="hidden" name="merchant_id" value={merchant_id} />
        <input type="hidden" name="merchant_key" value={merchant_key} />

        {/* Redirect URLs */}
        <input type="hidden" name="return_url" value={return_url} />
        <input type="hidden" name="cancel_url" value={cancel_url} />
        <input type="hidden" name="notify_url" value={notify_url} />

        {/* Order Details */}
        <input type="hidden" name="amount" value={total} />
        <input type="hidden" name="item_name" value="Envision3D Order" />
        <input type="hidden" name="m_payment_id" value={orderRef} />

        {/* Customer Email */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            name="email_address"
            placeholder="Enter your email"
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

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "12px 18px",
            borderRadius: "6px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
