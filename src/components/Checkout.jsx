import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Checkout({ total, orderRef, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Upload to Firebase
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
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const handleQuote = async () => {
    console.log("Submitting quote..."); // ✅ DEBUG

    const fileURL = await uploadFile();

    if (!fileURL && !link) {
      alert("Add file or link");
      return;
    }

    await onFileUpload({
      fileURL,
      modelLink: link,
    });

    alert("Quote submitted ✅");
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>

      {/* ✅ ALWAYS SHOW FOR CUSTOM */}
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Paste model link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* ✅ QUOTE */}
      {total === 0 && (
        <button onClick={handleQuote} disabled={loading}>
          {loading ? "Uploading..." : "Request Quote"}
        </button>
      )}

      {/* ✅ PAYMENT */}
      {total > 0 && (
        <form
          action="https://sandbox.payfast.co.za/eng/process"
          method="post"
        >
          <input type="hidden" name="amount" value={total} />
          <input type="hidden" name="item_name" value="Order" />

          <button type="submit">Pay Now</button>
        </form>
      )}
    </div>
  );
}
