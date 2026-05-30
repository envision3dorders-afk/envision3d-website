import { useState } from "react";

export default function Checkout({ total, orderRef, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";

  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";

  const handleQuote = () => {
    if (!file && !link) {
      alert("Please upload a file or paste a link");
      return;
    }

    onFileUpload({
      file,
      modelLink: link,
    });

    alert("Quote request submitted ✅");
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      {/* ✅ FILE */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* ✅ LINK */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Paste model link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* ✅ PAYMENT OR QUOTE */}
      {total > 0 ? (
        <form
          action="https://sandbox.payfast.co.za/eng/process"
          method="post"
        >
          <input type="hidden" name="merchant_id" value={merchant_id} />
          <input type="hidden" name="merchant_key" value={merchant_key} />

          <input type="hidden" name="return_url" value={return_url} />

          <input type="hidden" name="amount" value={total} />
          <input type="hidden" name="item_name" value="Order" />
          <input type="hidden" name="m_payment_id" value={orderRef} />

          <input
            type="email"
            name="email_address"
            placeholder="Email"
            required
          />

          <button type="submit">Pay Now</button>
        </form>
      ) : (
        <button onClick={handleQuote}>Request Quote</button>
      )}
    </div>
  );
}
