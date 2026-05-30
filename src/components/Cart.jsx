export default function Cart({ cart, total, startCheckout }) {
  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item, i) => (
        <p key={i}>{item.name}</p>
      ))}

      <p>Total: R{total}</p>

      <button onClick={startCheckout}>
        Checkout
      </button>
    </div>
  );
}
