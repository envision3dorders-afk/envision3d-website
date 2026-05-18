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
    }
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Products</h2>

      {filtered.map((p) => (
        <div key={p.id}>
          {p.image ? (
            {p.image}
          ) : (
            <div style={{ height: "140px", background: "#333" }} />
          )}

          <h3>{p.name}</h3>
          <p>{p.description}</p>

          <button onClick={() => setCart([...cart, p])}>
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
}
``
