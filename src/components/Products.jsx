export default function Products({ cart, setCart, search }) {

  const products = [
    {
      id: 1,
      name: "Custom 3D Print",
      price: "Quote-Based",
      image: null,
      description: "Upload your own 3D model"
    },
    {
      id: 2,
      name: "Phone Stand",
      price: 120,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Phone+Stand",
      description: "Compact stand"
    },
    {
      id: 3,
      name: "Miniature Figurine",
      price: 85,
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Miniature",
      description: "Mini collectible"
    }
  ];

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
            color: "#e5e7eb"
          }}
        >

          {/* ✅ ✅ ✅ THIS IS THE REAL FIX */}
          {p.image ? (
            {p.image}
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
                color: "#aaa"
              }}
            >
              Custom Upload
            </div>
          )}

          <h3>{p.name}</h3>
          <p>{p.description}</p>

          <p>
            <strong>
              {typeof p.price === "number"
                ? `R${p.price}`
                : p.price}
            </strong>
          </p>

          <button
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => setCart([...cart, p])}
          >
            Add to Cart
          </button>

        </div>
      ))}
    </>
  );
}
