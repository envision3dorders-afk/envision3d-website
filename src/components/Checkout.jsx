export default function Checkout({ total, orderRef }) {
  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>
    </div>
  );
}
