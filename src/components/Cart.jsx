export default function Cart({ cart, removeItem, total, startCheckout }) {
  return (
    <>
      <h2>Cart</h2>

      {cart.map((item, i) => (
        <div key={i}>
          {item.name} - {item.price}
          <button onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}

      <h3>Total: R{total}</h3>

      <button onClick={startCheckout}>
        Checkout
      </button>
    </>
  );
}
