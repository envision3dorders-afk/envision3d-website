import { useState } from "react";

export default function Checkout({ total, onFileUpload }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  const handleQuote = async () => {
    console.log("✅ handleQuote triggered");

    if (!file && !link) {
      alert("Please upload a file or enter a link");
      return;
    }

    try {
      await onFileUpload({
        fileURL: null,
        modelLink: link,
      });

      alert("Quote submitted ✅");

    } catch (error) {
      console.error("Quote error:", error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R0</p>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Paste model link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <button onClick={handleQuote}>
        Request Quote
      </button>
    </div>
  );
}
