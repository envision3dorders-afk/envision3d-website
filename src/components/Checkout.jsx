export default function Checkout({ total, orderRef }) {
  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";

  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const cancel_url = return_url;
  const notify_url = return_url;

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      {total > 0 ? (
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
          <input type="hidden" name="item_name" value="Order" />
          <input type="hidden" name="m_payment_id" value={orderRef} />

          <div>
            <input
              type="email"
              name="email_address"
              placeholder="Email"
              required
            />
          </div>

          <button type="submit">Pay Now</button>
        </form>
      ) : (
        <p style={{ color: "orange" }}>
          This order requires a quote before payment.
        </p>
      )}
    </div>
  );
}
