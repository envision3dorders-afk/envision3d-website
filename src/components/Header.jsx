import logo from "../assets/logo-circle.jpeg";

export default function Header({ search, setSearch, cart, orders, setView }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 30px",
      background: "#0b0d11",
      alignItems: "center",
      color: "#fff"
    }}>
      <h2 onClick={() => setView("products")} style={{ cursor: "pointer" }}>
        Envision3D
      </h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setView("cart")}>
        Cart ({cart.length})
      </button>

      <button onClick={() => setView("orders")}>
        Orders ({orders.length})
      </button>

      <img src={logo} alt="logo" style={{ width: "40px" }} />
    </div>
  );
}
``
