export default function Products({ cart, setCart, search, setView }) {
  // ✅ PRODUCTS DATA
  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      description: "Upload your own 3D model",
    },
    {
      id: 2,
      name: "Phone Stand",
      price: 120,
      image:
        "https://dummyimage.com/300x200/cccccc/000000&text=Phone+Stand",
      description: "Compact stand",
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: 85,
      image:
        "https://dummyimage.com/300x200/cccccc/000000&text=Miniature",
      description: "Mini collectible",
    },
  ];

  // ✅ FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Products</h2>

      {filteredProducts.map((p) => (
        <div
          key={p.id}
          style={{
            background: "#1c1f26",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #2a2e37",
            color: "#e5e7eb",
          }}
        >
          {/* IMAGE */}
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                maxWidth: "200px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
          ) : (
            <div
              style={{
                height: "140px",
                background: "#333",
                borderRadius: "8px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Custom Upload
            </div>
          )}

          <h3>{p.name}</h3>
          <p>{p.description}</p>

          <p>
            <strong>
              {typeof p.price === "number" ? `R${p.price}` : p.price}
            </strong>
          </p>

          {/* ✅ SMART BUTTON */}
          {typeof p.price === "number" ? (
            // ✅ Normal products
            <button
              onClick={() => setCart([...cart, p])}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          ) : (
            // ✅ Custom product (quote)
            <button
              onClick={() => {
                setCart([p]); // only custom item
                setView("checkout"); // go straight to checkout
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#f59e0b",
                color: "#000",
                border: "none",
                cursor: "pointer",
              }}
            >
              Request Quote
            </button>
          )}
        </div>
      ))}
    </>
  );
}
