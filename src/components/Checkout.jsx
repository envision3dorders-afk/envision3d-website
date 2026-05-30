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
      // ✅ For now, no upload — just pass data
      await onFileUpload({
        fileURL: null,
        modelLink: link,
      });

      alert("Quote submitted ✅");

    } catch (error) {
      console.error("Quote error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R0</p>

      {/* ✅ FILE INPUT */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* ✅ LINK INPUT */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Paste model link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* ✅ BUTTON */}
      <button onClick={handleQuote}>
        Request Quote
      </button>
    </div>
  );
}
