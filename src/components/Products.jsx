export default function Products({ cart, setCart, search, setView }) {
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
      image: "https://dummyimage.com/300x200/cccccc/000000&text=Phone+Stand",
      description: "Compact stand",
    },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Products</h2>

      {filteredProducts.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>

          <p>
            {typeof p.price === "number" ? `R${p.price}` : p.price}
          </p>

          {typeof p.price === "number" ? (
            <button onClick={() => setCart([...cart, p])}>
              Add to Cart
            </button>
          ) : (
            <button
              onClick={() => {
                setCart([p]);     // ✅ put item in cart
                setView("cart");  // ✅ go to cart FIRST
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
