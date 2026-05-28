export default function Orders({ orders, updateStatus, deleteOrder }) {
  return (
    <>
      <h2>Orders</h2>

      {orders.map((o) => (
        <div key={o.id}>
          <p>{o.ref}</p>
          <p>Status: {o.status}</p>

          <button onClick={() => updateStatus(o.id, "Paid")}>
            Paid
          </button>

          <button onClick={() => updateStatus(o.id, "Completed")}>
            Completed
          </button>

          <button onClick={() => deleteOrder(o.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
``
