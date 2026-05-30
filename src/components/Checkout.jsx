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

  const return_url =
    "https://envision3d-website-jivechjaa-orders-6322s-projects.vercel.app";
  const cancel_url = return_url;
  const notify_url = return_url;

  // ✅ Handle file upload
  const handleUpload = async () => {
    if (!file) return null;

    setLoading(true);

    try {
      const storageRef = ref(storage, `models/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setLoading(false);
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
      return null;
    }
  };

  // ✅ Handle submit (quote OR payment)
  const handleSubmit = async (e) => {
    if (total === 0) {
      // Quote-based flow
      e.preventDefault();

      const fileURL = await handleUpload();

      if (!fileURL && !link) {
        alert("Please upload a file or provide a link.");
        return;
      }

      onFileUpload({
        fileURL,
        modelLink: link,
      });

      alert("✅ Request submitted! We will provide a quote.");
    }
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
          placeholder="https://thingiverse.com/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>

      {/* ✅ PAYMENT OR QUOTE */}
      {total > 0 ? (
        // ✅ PAYFAST FLOW
        <form
          action="https://sandbox.payfast.co.za/eng/process"
          method="post"
        >
          <input
            type="hidden"
            name="merchant_id"
            value={merchant_id}
          />
          <input
            type="hidden"
            name="merchant_key"
            value={merchant_key}
          />

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
          onClick={handleSubmit}
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
``
