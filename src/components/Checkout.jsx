import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Checkout({ total, orderRef, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";

  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const cancel_url = return_url;
  const notify_url = return_url;

  // Upload file
  const uploadFile = async () => {
    if (!file) return null;

    setLoading(true);

    try {
      const storageRef = ref(
        storage,
        `models/${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setLoading(false);
      return url;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return null;
    }
  };

  // Quote logic
  const handleQuote = async () => {
    const fileURL = await uploadFile();

    if (!fileURL && !link) {
      alert("Upload a file or provide a link");
      return;
    }

    await onFileUpload({
      fileURL,
      modelLink: link,
    });

    alert("Quote request submitted ✅");
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      {/* FILE */}
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* LINK */}
      <div>
        <input
          type="text"
          placeholder="Paste model link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* ✅ KEY FIX HERE */}
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

          <input
            type="email"
            name="email_address"
            placeholder="Email"
            required
          />

          <button type="submit">Pay Now</button>
        </form>
      ) : (
        <button onClick={handleQuote} disabled={loading}>
          {loading ? "Uploading..." : "Request Quote"}
        </button>
      )}
    </div>
  );
}
