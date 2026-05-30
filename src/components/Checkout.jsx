import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Checkout({ total, orderRef, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.error("Upload error:", err);
      setLoading(false);
      return null;
    }
  };

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

    alert("✅ Quote request submitted!");
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

      {/* QUOTE ONLY (for custom orders) */}
      {total === 0 && (
        <button onClick={handleQuote} disabled={loading}>
          {loading ? "Uploading..." : "Request Quote"}
        </button>
      )}
    </div>
  );
}
