import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Checkout({ total, orderRef, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ PayFast sandbox credentials
  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";

  // ✅ Replace with your actual deployed URL
  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const cancel_url = return_url;
  const notify_url = return_url;

  // ✅ Upload file to Firebase Storage
  const uploadFile = async () => {
    if (!file) return null;

    try {
      setLoading(true);

      const storageRef = ref(
        storage,
        `models/${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setLoading(false);
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      setLoading(false);
      return null;
    }
  };

  // ✅ Handle quote submission
  const handleQuote = async () => {
    const fileURL = await uploadFile();

    if (!fileURL && !link) {
      alert("Please upload a file or provide a link.");
      return;
    }

    await onFileUpload({
      fileURL: fileURL || null,
      modelLink: link || null,
    });

    alert("✅ Quote request sent!");
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      {/* ✅ FILE UPLOAD */}
      <div style={{ marginBottom: "15px" }}>
        <label>Upload STL/File (optional)</label>
        <br />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* ✅ LINK INPUT */}
      <div style={{ marginBottom: "15px" }}>
        <label>OR paste model link</label>
        <br />
        <input
          type="text"
          placeholder="https://example.com/model"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>

      {/* ✅ PAYMENT OR QUOTE FLOW */}
      {total > 0 ? (
        // ✅ PAYFAST FORM (FIXED — THIS REMOVES RED ❌)
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
          <input
            type="hidden"
            name="item_name"
            value="Envision3D Order"
          />
          <input
            type="hidden"
            name="m_payment_id"
            value={orderRef}
          />

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
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
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
      ) : (
        // ✅ QUOTE FLOW
        <button
          onClick={handleQuote}
          disabled={loading}
          style={{
            padding: "12px",
            background: "#f59e0b",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Uploading..." : "Request Quote"}
        </button>
      )}
    </div>
  );
}
