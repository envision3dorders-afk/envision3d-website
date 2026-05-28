export default function Checkout({ total, orderRef, handleSubmit }) {
  return (
    <div>
      <h2>Checkout</h2>

      <p>Total: R{total}</p>
      <p>Reference: {orderRef}</p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required />

        <input type="hidden" name="orderRef" value={orderRef} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
